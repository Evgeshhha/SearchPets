import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPets } from '../api/petApi';
import type { PetFilters } from './filter';
import type { PetAd } from './types';

const PAGE_SIZE = 12;

interface ListState {
    status: 'loading' | 'ready' | 'error';
    items: PetAd[];
    hasMore: boolean;
    loadingMore: boolean;
    message?: string;
    moreError?: string;
}

const messageOf = (error: unknown) => (error instanceof Error ? error.message : 'Неизвестная ошибка');

export function usePetList({ status, kind, query }: PetFilters) {
    const [state, setState] = useState<ListState>({ status: 'loading', items: [], hasMore: false, loadingMore: false });
    const [attempt, setAttempt] = useState(0);
    const generation = useRef(0);

    useEffect(() => {
        const current = ++generation.current;
        setState({ status: 'loading', items: [], hasMore: false, loadingMore: false });
        fetchPets({ status, kind, query, limit: PAGE_SIZE, offset: 0 }).then(
            (items) => {
                if (current !== generation.current) return;
                setState({ status: 'ready', items, hasMore: items.length === PAGE_SIZE, loadingMore: false });
            },
            (error: unknown) => {
                if (current !== generation.current) return;
                setState({ status: 'error', items: [], hasMore: false, loadingMore: false, message: messageOf(error) });
            },
        );
    }, [status, kind, query, attempt]);

    const loadMore = useCallback(() => {
        if (state.status !== 'ready' || !state.hasMore || state.loadingMore) return;
        const current = generation.current;
        setState((s) => ({ ...s, loadingMore: true, moreError: undefined }));
        fetchPets({ status, kind, query, limit: PAGE_SIZE, offset: state.items.length }).then(
            (more) => {
                if (current !== generation.current) return;
                setState((s) => {
                    const known = new Set(s.items.map((p) => p.id)); // новые объявления сдвигают страницы — убираем дубли
                    return {
                        ...s,
                        items: [...s.items, ...more.filter((p) => !known.has(p.id))],
                        hasMore: more.length === PAGE_SIZE,
                        loadingMore: false,
                    };
                });
            },
            (error: unknown) => {
                if (current !== generation.current) return;
                setState((s) => ({ ...s, loadingMore: false, moreError: messageOf(error) }));
            },
        );
    }, [state, status, kind, query]);

    const reload = useCallback(() => setAttempt((a) => a + 1), []);

    return { state, loadMore, reload };
}
