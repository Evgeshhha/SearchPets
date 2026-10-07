import type { PetAd } from '../types';

export const MOCK_PETS: PetAd[] = [
  {
    id: '1',
    name: 'Рекс',
    kind: 'dog',
    breed: 'Немецкая овчарка',
    color: 'Чёрно-рыжий',
    description: 'Откликается на кличку, на нём синий ошейник. Дружелюбный.',
    lastSeenPlace: 'Парк Горького, у главного входа',
    lastSeenDate: '2026-10-01',
    status: 'searching',
    contactName: 'Анна',
    contactPhone: '+7 900 000-00-01',
    photoUrl: 'https://placehold.co/600x400?text=Rex',
  },
  {
    id: '2',
    name: 'Мурка',
    kind: 'cat',
    breed: 'Дворовая',
    color: 'Серая полосатая',
    description: 'Без ошейника, боится громких звуков.',
    lastSeenPlace: 'ул. Ленина, 15',
    lastSeenDate: '2026-09-28',
    status: 'found',
    contactName: 'Игорь',
    contactPhone: '+7 900 000-00-02',
    photoUrl: 'https://placehold.co/600x400?text=Murka',
  },
  {
    id: '3',
    name: 'Кеша',
    kind: 'other',
    breed: 'Волнистый попугай',
    color: 'Зелёный',
    description: 'Улетел с балкона, может говорить несколько слов.',
    lastSeenPlace: 'Микрорайон Северный',
    lastSeenDate: '2026-10-05',
    status: 'searching',
    contactName: 'Мария',
    contactPhone: '+7 900 000-00-03',
  },
];

export const getPetById = (id?: string) => MOCK_PETS.find((p) => p.id === id);