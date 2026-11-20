import type { PetAd } from './types';

export function canManagePet(pet: PetAd, user: { id: number; isAdmin: boolean } | null): boolean {
    return Boolean(user && (user.isAdmin || user.id === pet.ownerId));
}
