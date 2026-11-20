export function formatDate(iso: string): string {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString('ru-RU');
}

export function formatDateTime(iso: string): string {
    const date = new Date(iso);
    return Number.isNaN(date.getTime())
        ? iso
        : date.toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
}

export function todayIso(): string {
    return new Date().toLocaleDateString('sv-SE');
}

export function nowForInput(): string {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function inputToIso(value: string): string {
    return new Date(value).toISOString();
}