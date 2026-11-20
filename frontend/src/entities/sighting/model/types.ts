export interface Sighting {
    id: number;
    place: string;
    seenAt: string;
    comment: string;
    contact: string;
}

export interface NewSightingInput {
    place: string;
    seenAt: string;
    comment: string;
    contact: string;
}
