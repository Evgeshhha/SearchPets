import type { PetAd, PetKind, PetStatus } from './types';

export interface PetFilters {
    status: PetStatus | '';
    kind: PetKind | '';
    query: string;
}

export const EMPTY_FILTERS: PetFilters = { status: '', kind: '', query: '' };

export const hasActiveFilters = (f: PetFilters) => Boolean(f.status || f.kind || f.query.trim());

export function filterPets(pets: PetAd[], f: PetFilters): PetAd[] {
    const query = f.query.trim().toLowerCase();
    return pets.filter((p) => {
        if (f.status && p.status !== f.status) return false;
        if (f.kind && p.kind !== f.kind) return false;
        if (query) {
            const haystack = `${p.name} ${p.breed} ${p.color} ${p.lastSeenPlace}`.toLowerCase();
            if (!haystack.includes(query)) return false;
        }
        return true;
    });
}
