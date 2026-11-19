import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EMPTY_FILTERS, PET_KINDS, PET_STATUSES } from '../../../entities/pet';
import type { PetFilters } from '../../../entities/pet';

/**
 * Состояние фильтров списка. Дублируется в адресной строке (?status=&kind=&q=),
 * поэтому после перехода в карточку и кнопки «Назад» фильтры сохраняются.
 */
export function usePetFilters() {
    const [params, setParams] = useSearchParams();
    const [filters, setFilters] = useState<PetFilters>(() => ({
        status: PET_STATUSES.find((s) => s === params.get('status')) ?? '',
        kind: PET_KINDS.find((k) => k === params.get('kind')) ?? '',
        query: params.get('q') ?? '',
    }));

    useEffect(() => {
        setParams(
            (prev) => {
                const next = new URLSearchParams(prev); // остальные параметры (например, demo) сохраняем
                const apply = (key: string, value: string) => (value ? next.set(key, value) : next.delete(key));
                apply('status', filters.status);
                apply('kind', filters.kind);
                apply('q', filters.query);
                return next;
            },
            { replace: true },
        );
    }, [filters.status, filters.kind, filters.query]);

    const reset = () => setFilters(EMPTY_FILTERS);

    return { filters, setFilters, reset };
}
