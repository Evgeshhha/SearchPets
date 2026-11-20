const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
    const value = email.trim();
    if (!value) return 'Укажите email';
    if (value.length > 254 || !EMAIL.test(value)) return 'Введите корректный email';
}

export function validateNewPassword(password: string): string | undefined {
    if (!password) return 'Придумайте пароль';
    if (password.length < 8) return 'Не менее 8 символов';
    if (password.length > 128) return 'Не более 128 символов';
    if (!/\p{L}/u.test(password) || !/\d/.test(password)) return 'Нужна хотя бы одна буква и одна цифра';
}

export function validatePersonName(name: string): string | undefined {
    const value = name.trim();
    if (!value) return 'Укажите имя';
    if (value.length < 2) return 'Минимум 2 символа';
    if (value.length > 100) return 'Не более 100 символов';
}
