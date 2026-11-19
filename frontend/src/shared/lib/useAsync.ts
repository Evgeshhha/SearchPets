import { useCallback, useEffect, useState } from 'react';
import type { DependencyList } from 'react';

export type AsyncState<T> =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'success'; data: T };

export function useAsync<T>(load: () => Promise<T>, deps: DependencyList) {
    const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;
        setState({ status: 'loading' });
        load().then(
            (data) => {
                if (active) setState({ status: 'success', data });
            },
            (error: unknown) => {
                if (active) {
                    setState({
                        status: 'error',
                        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
                    });
                }
            },
        );
        return () => {
            active = false;
        };
    }, [...deps, attempt]);

    const reload = useCallback(() => setAttempt((a) => a + 1), []);
    const setData = useCallback((data: T) => setState({ status: 'success', data }), []);

    return { state, reload, setData };
}
