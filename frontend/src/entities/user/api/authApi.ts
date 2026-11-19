import { apiFetch, clearTokens, getRefreshToken, setTokens } from '../../../shared/api';
import type { TokenPairDto } from '../../../shared/api';
import type { RegisterInput, User } from '../model/types';

interface UserDto {
    id: number;
    email: string;
    name: string;
    is_admin: boolean;
}

const toUser = (dto: UserDto): User => ({ id: dto.id, email: dto.email, name: dto.name, isAdmin: dto.is_admin });

export async function registerUser(input: RegisterInput): Promise<void> {
    await apiFetch<UserDto>('/api/auth/register', { method: 'POST', body: input });
}

export async function loginUser(email: string, password: string): Promise<void> {
    const tokens = await apiFetch<TokenPairDto>('/api/auth/login', { method: 'POST', body: { email, password } });
    setTokens(tokens.access_token, tokens.refresh_token);
}

export async function fetchCurrentUser(): Promise<User> {
    return toUser(await apiFetch<UserDto>('/api/auth/me', { auth: true }));
}


export async function logoutUser(): Promise<void> {
    const refreshToken = getRefreshToken();
    clearTokens();
    if (refreshToken) {
        await apiFetch<void>('/api/auth/logout', { method: 'POST', body: { refresh_token: refreshToken } });
    }
}
