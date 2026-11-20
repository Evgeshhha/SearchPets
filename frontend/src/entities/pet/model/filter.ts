import type { PetKind, PetStatus } from './types';

export interface PetFilters {
    status: PetStatus | '';
    kind: PetKind | '';
    query: string;
}

export const EMPTY_FILTERS: PetFilters = { status: '', kind: '', query: '' };

export const hasActiveFilters = (f: PetFilters) => Boolean(f.status || f.kind || f.query.trim());