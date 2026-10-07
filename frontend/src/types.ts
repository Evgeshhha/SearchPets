export type PetStatus = 'searching' | 'found' | 'closed';
export type PetKind = 'dog' | 'cat' | 'other';

export interface PetAd {
  id: string;
  name: string;
  kind: PetKind;
  breed: string;
  color: string;
  description: string;
  lastSeenPlace: string;
  lastSeenDate: string;
  status: PetStatus;
  contactName: string;
  contactPhone: string;
  photoUrl?: string;
}

export const STATUS_LABEL: Record<PetStatus, string> = {
  searching: 'Ищем',
  found: 'Найден',
  closed: 'Закрыто',
};

export const KIND_LABEL: Record<PetKind, string> = {
  dog: 'Собака',
  cat: 'Кошка',
  other: 'Другое',
};