import { API_URL } from '../../../shared/config';
import { ApiError, apiFetch } from '../../../shared/api';
import type { PetFilters } from '../model/filter';
import type { NewPetInput, PetAd, PetKind, PetStatus } from '../model/types';

interface AnnouncementDto {
    id: number;
    pet: {
        name: string;
        kind: PetKind;
        breed: string | null;
        color: string | null;
        description: string | null;
        photo_url: string | null;
    };
    last_seen_place: string;
    last_seen_at: string;
    status: PetStatus;
    contact_name: string;
    contact_phone: string;
    flyer_template_id: number | null;
    owner_id: number | null;
}

const mediaUrl = (url: string | null): string | undefined => {
    if (!url) return undefined;
    return url.startsWith('/') ? `${API_URL}${url}` : url; 
};

const toPetAd = (dto: AnnouncementDto): PetAd => ({
    id: String(dto.id),
    name: dto.pet.name,
    kind: dto.pet.kind,
    breed: dto.pet.breed ?? '',
    color: dto.pet.color ?? '',
    description: dto.pet.description ?? '',
    lastSeenPlace: dto.last_seen_place,
    lastSeenDate: dto.last_seen_at,
    status: dto.status,
    contactName: dto.contact_name,
    contactPhone: dto.contact_phone,
    photoUrl: mediaUrl(dto.pet.photo_url),
    ownerId: dto.owner_id,
    flyerTemplateId: dto.flyer_template_id,
});

const orNull = (value: string) => value.trim() || null;


export interface PetListQuery extends PetFilters {
    limit: number;
    offset: number;
}

export async function fetchPets({ status, kind, query, limit, offset }: PetListQuery): Promise<PetAd[]> {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (status) params.set('status', status);
    if (kind) params.set('kind', kind);
    if (query.trim()) params.set('q', query.trim());
    const items = await apiFetch<AnnouncementDto[]>(`/api/announcements?${params}`);
    return items.map(toPetAd);
}

export async function fetchPet(id?: string): Promise<PetAd | undefined> {
    if (!id || !/^\d+$/.test(id)) return undefined;
    try {
        return toPetAd(await apiFetch<AnnouncementDto>(`/api/announcements/${id}`));
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) return undefined;
        throw error;
    }
}


export async function createPet(input: NewPetInput, photo: File | null): Promise<PetAd> {
    const photoUrl = photo ? await uploadPhoto(photo) : null;
    const created = await apiFetch<AnnouncementDto>('/api/announcements', {
        method: 'POST',
        auth: true,
        body: {
            pet: {
                name: input.name,
                kind: input.kind,
                breed: orNull(input.breed),
                color: orNull(input.color),
                description: orNull(input.description),
                photo_url: photoUrl,
            },
            last_seen_place: input.lastSeenPlace,
            last_seen_at: input.lastSeenDate,
            contact_name: input.contactName,
            contact_phone: input.contactPhone,
        },
    });
    return toPetAd(created);
}

export async function updatePetStatus(id: string, status: PetStatus): Promise<PetAd> {
    const updated = await apiFetch<AnnouncementDto>(`/api/announcements/${id}`, {
        method: 'PATCH',
        auth: true,
        body: { status },
    });
    return toPetAd(updated);
}

export async function deletePet(id: string): Promise<void> {
    await apiFetch<void>(`/api/announcements/${id}`, { method: 'DELETE', auth: true });
}

export type PhotoChange = { kind: 'keep' } | { kind: 'replace'; file: File } | { kind: 'remove' };

async function uploadPhoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    return (await apiFetch<{ url: string }>('/api/uploads', { method: 'POST', formData, auth: true })).url;
}

export async function updatePet(id: string, input: NewPetInput, photo: PhotoChange): Promise<PetAd> {
    const pet: Record<string, unknown> = {
        name: input.name,
        kind: input.kind,
        breed: orNull(input.breed),
        color: orNull(input.color),
        description: orNull(input.description),
    };
    if (photo.kind === 'replace') pet.photo_url = await uploadPhoto(photo.file);
    if (photo.kind === 'remove') pet.photo_url = null;

    const updated = await apiFetch<AnnouncementDto>(`/api/announcements/${id}`, {
        method: 'PATCH',
        auth: true,
        body: {
            last_seen_place: input.lastSeenPlace,
            last_seen_at: input.lastSeenDate,
            contact_name: input.contactName,
            contact_phone: input.contactPhone,
            pet,
        },
    });
    return toPetAd(updated);
}

export async function fetchShareInfo(id: string): Promise<{ url: string; title: string; text: string }> {
    return apiFetch(`/api/announcements/${id}/share`);
}
