import { API_URL } from '../config';
import { clearTokens, getAccessToken, getRefreshToken, notifySessionExpired, setTokens } from './tokenStorage';

export class ApiError extends Error {
    status: number;
    fields: Record<string, string>;

    constructor(message: string, status: number, fields: Record<string, string> = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.fields = fields;
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

interface ValidationItem {
    loc?: unknown[];
    msg?: string;
    type?: string;
    ctx?: { min_length?: number; max_length?: number };
}

function translate(item: ValidationItem): string {
    switch (item.type) {
        case 'missing':
            return 'Обязательное поле';
        case 'string_too_short':
            return `Минимум символов: ${item.ctx?.min_length ?? 1}`;
        case 'string_too_long':
            return `Максимум символов: ${item.ctx?.max_length ?? ''}`.trim();
        case 'string_pattern_mismatch':
            return 'Недопустимый формат';
        case 'enum':
            return 'Недопустимое значение';
        default:
            return (item.msg ?? 'Некорректное значение').replace(/^Value error,\s*/, '');
    }
}

const FALLBACK_BY_STATUS = (status: number): string => {
    if (status === 401) return 'Сессия истекла. Войдите снова.';
    if (status === 403) return 'Недостаточно прав для этого действия.';
    if (status === 404) return 'Ничего не найдено.';
    if (status === 429) return 'Слишком много запросов. Попробуйте чуть позже.';
    if (status >= 500) return 'Ошибка на сервере. Попробуйте позже.';
    return `Не удалось выполнить запрос (${status}).`;
};

function toApiError(status: number, body: unknown): ApiError {
    const detail = body && typeof body === 'object' ? (body as { detail?: unknown }).detail : undefined;

    if (typeof detail === 'string' && detail) return new ApiError(detail, status);

    if (Array.isArray(detail) && detail.length > 0) {
        const fields: Record<string, string> = {};
        const general: string[] = [];
        for (const item of detail as ValidationItem[]) {
            const path = (item.loc ?? []).slice(1).join('.');
            const text = translate(item);
            if (path) fields[path] ??= text;
            else general.push(text); 
        }
        const message = general.length ? general.join('. ') : 'Проверьте правильность заполнения полей.';
        return new ApiError(message, status, fields);
    }
    return new ApiError(FALLBACK_BY_STATUS(status), status);
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
    if (!res.ok) {
        const error = toApiError(res.status, data);
        if (auth && res.status === 401) error.message = 'Сессия истекла. Войдите снова.';
        throw error;
    }
    return data as T;
}
