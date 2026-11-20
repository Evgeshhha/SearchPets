import { apiFetch } from '../../../shared/api';
import type { NewSightingInput, Sighting } from '../model/types';

interface SightingDto {
    id: number;
    place: string;
    seen_at: string;
    comment: string | null;
    contact: string | null;
}

const toSighting = (dto: SightingDto): Sighting => ({
    id: dto.id,
    place: dto.place,
    seenAt: dto.seen_at,
    comment: dto.comment ?? '',
    contact: dto.contact ?? '',
});

const orNull = (value: string) => value.trim() || null;


export async function fetchSightings(announcementId: string): Promise<Sighting[]> {
    const items = await apiFetch<SightingDto[]>(`/api/announcements/${announcementId}/sightings`);
    return items.map(toSighting);
}

export async function createSighting(announcementId: string, input: NewSightingInput): Promise<Sighting> {
    const created = await apiFetch<SightingDto>(`/api/announcements/${announcementId}/sightings`, {
        method: 'POST',
        body: {
            place: input.place.trim(),
            seen_at: input.seenAt,
            comment: orNull(input.comment),
            contact: orNull(input.contact),
        },
    });
    return toSighting(created);
}

export async function deleteSighting(announcementId: string, sightingId: number): Promise<void> {
    await apiFetch<void>(`/api/announcements/${announcementId}/sightings/${sightingId}`, {
        method: 'DELETE',
        auth: true,
    });
}
