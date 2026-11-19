const REFRESH_KEY = 'searchpets.refresh_token';

let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export function getRefreshToken(): string | null {
    try {
        return localStorage.getItem(REFRESH_KEY);
    } catch {
        return null;
    }
}

export function setTokens(access: string, refresh: string): void {
    accessToken = access;
    try {
        localStorage.setItem(REFRESH_KEY, refresh);
    } catch {
    }
}

export function clearTokens(): void {
    accessToken = null;
    try {
        localStorage.removeItem(REFRESH_KEY);
    } catch {
    }
}

const expiredListeners = new Set<() => void>();

export function onSessionExpired(listener: () => void): () => void {
    expiredListeners.add(listener);
    return () => {
        expiredListeners.delete(listener);
    };
}

export function notifySessionExpired(): void {
    expiredListeners.forEach((listener) => listener());
}
