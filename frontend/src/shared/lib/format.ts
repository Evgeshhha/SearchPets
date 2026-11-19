export function formatDate(iso: string): string {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString('ru-RU');
}

export function todayIso(): string {
    return new Date().toLocaleDateString('sv-SE');
}
