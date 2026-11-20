import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PET_KINDS, PET_STATUSES } from '../../../entities/pet';
import type { PetFilters } from '../../../entities/pet';

const QUERY_DEBOUNCE_MS = 300;

export function usePetFilters() {
    const [params, setParams] = useSearchParams();

    const status = PET_STATUSES.find((s) => s === params.get('status')) ?? '';
    const kind = PET_KINDS.find((k) => k === params.get('kind')) ?? '';
    const urlQuery = params.get('q') ?? '';

    const [queryInput, setQueryInput] = useState(urlQuery);

    const update = (patch: Record<string, string>) =>
        setParams(
            (prev) => {
                const next = new URLSearchParams(prev); 
                for (const [key, value] of Object.entries(patch)) {
                    if (value) next.set(key, value);
                    else next.delete(key);
                }
                return next;
            },
            { replace: true },
        );

    const updateRef = useRef(update);
    updateRef.current = update;

    useEffect(() => {
        setQueryInput((prev) => (prev.trim() === urlQuery ? prev : urlQuery));
    }, [urlQuery]);

    useEffect(() => {
        if (queryInput.trim() === urlQuery) return;
        const timer = setTimeout(() => updateRef.current({ q: queryInput.trim() }), QUERY_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [queryInput]);

    const filters: PetFilters = { status, kind, query: queryInput };
    const applied: PetFilters = { status, kind, query: urlQuery };

    const setFilters = (next: PetFilters) => {
        update({ status: next.status, kind: next.kind });
        setQueryInput(next.query);
    };

    const reset = () => {
        update({ status: '', kind: '', q: '' });
        setQueryInput('');
    };

    return { filters, applied, setFilters, reset };
}
