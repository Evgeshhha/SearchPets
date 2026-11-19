import { API_URL } from '../config';
import { clearTokens, getAccessToken, getRefreshToken, notifySessionExpired, setTokens } from './tokenStorage';

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export interface TokenPairDto {
    access_token: string;
    refresh_token: string;
}

interface Prepared {
    method: string;
    headers: Record<string, string>;
    body?: BodyInit;
}

function messageFrom(body: unknown, fallback: string): string {
    if (body && typeof body === 'object' && 'detail' in body) {
        const detail = (body as { detail: unknown }).detail;
        if (typeof detail === 'string') return detail;
        if (Array.isArray(detail)) {
            const messages = detail
                .map((d) => (d && typeof d === 'object' && typeof d.msg === 'string' ? d.msg : ''))
                .filter(Boolean);
            if (messages.length) return messages.join('; ');
        }
    }
    return fallback;
}

async function send(path: string, request: Prepared, token?: string | null): Promise<Response> {
    const headers = { ...request.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
        return await fetch(`${API_URL}${path}`, { method: request.method, headers, body: request.body });
    } catch {
        throw new ApiError('Нет связи с сервером. Проверьте соединение и попробуйте снова.', 0);
    }
}

let refreshing: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const res = await send('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (res.ok) {
        const tokens = (await res.json()) as TokenPairDto;
        setTokens(tokens.access_token, tokens.refresh_token);
        return true;
    }
    if (res.status === 401 || res.status === 422) {
        // Сервер отклонил refresh token (истёк, отозван, неверный) — сессии больше нет
        clearTokens();
        notifySessionExpired();
    }
    return false;
}

export function refreshSession(): Promise<boolean> {
    refreshing ??= doRefresh().finally(() => {
        refreshing = null;
    });
    return refreshing;
}

interface Options {
    method?: string;
    body?: unknown;
    formData?: FormData;
    /** Отправлять access token; при 401 один раз обновить его и повторить запрос. */
    auth?: boolean;
}

export async function apiFetch<T>(path: string, { method = 'GET', body, formData, auth = false }: Options = {}): Promise<T> {
    const request: Prepared = { method, headers: {} };
    if (formData) {
        request.body = formData;
    } else if (body !== undefined) {
        request.headers['Content-Type'] = 'application/json';
        request.body = JSON.stringify(body);
    }

    let token = auth ? getAccessToken() : null;
    if (auth && !token && getRefreshToken() && (await refreshSession())) {
        token = getAccessToken();
    }

    let res = await send(path, request, token);
    if (auth && res.status === 401 && getRefreshToken() && (await refreshSession())) {
        res = await send(path, request, getAccessToken());
    }

    if (res.status === 204) return undefined as T;
    const data: unknown = await res.json().catch(() => null);
    if (!res.ok) throw new ApiError(messageFrom(data, `Ошибка сервера (${res.status})`), res.status);
    return data as T;
}
