import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getRefreshToken, onSessionExpired } from '../../../shared/api';
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from '../api/authApi';
import { AuthContext } from './AuthContext';
import type { AuthContextValue, AuthStatus } from './AuthContext';
import type { User } from './types';

interface State {
    status: AuthStatus;
    user: User | null;
}

const ANONYMOUS: State = { status: 'anonymous', user: null };

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<State>(() => ({
        status: getRefreshToken() ? 'loading' : 'anonymous',
        user: null,
    }));

    useEffect(() => {
        let active = true;
        if (getRefreshToken()) {
            fetchCurrentUser().then(
                (user) => active && setState({ status: 'authenticated', user }),
                () => active && setState(ANONYMOUS),
            );
        }
        const unsubscribe = onSessionExpired(() => setState(ANONYMOUS));
        return () => {
            active = false;
            unsubscribe();
        };
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        await loginUser(email, password);
        setState({ status: 'authenticated', user: await fetchCurrentUser() });
    }, []);

    const register = useCallback(
        async (input: { name: string; email: string; password: string }) => {
            await registerUser(input);
            await login(input.email, input.password);
        },
        [login],
    );

    const logout = useCallback(async () => {
        setState(ANONYMOUS);
        try {
            await logoutUser(); 
        } catch {
        }
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({ ...state, login, register, logout }),
        [state, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
