import { sleep } from '../../../shared/lib';
import type { NewPetInput, PetAd, PetStatus } from '../model/types';
import { MOCK_PETS } from './mock';

const NETWORK_DELAY_MS = 700;

let pets: PetAd[] = [...MOCK_PETS];

const demoMode = () => new URLSearchParams(window.location.search).get('demo');

async function simulateNetwork() {
    await sleep(NETWORK_DELAY_MS);
    if (demoMode() === 'error') {
        throw new Error('Не удалось связаться с сервером. Проверьте соединение и попробуйте снова.');
    }
}

export async function fetchPets(): Promise<PetAd[]> {
    await simulateNetwork();
    return demoMode() === 'empty' ? [] : [...pets];
}

export async function fetchPet(id?: string): Promise<PetAd | undefined> {
    await simulateNetwork();
    return pets.find((p) => p.id === id);
}

export async function createPet(input: NewPetInput): Promise<PetAd> {
    await simulateNetwork();
    const pet: PetAd = { ...input, id: String(Date.now()), status: 'searching' };
    pets = [pet, ...pets];
    return pet;
}

export async function updatePetStatus(id: string, status: PetStatus): Promise<PetAd> {
    await simulateNetwork();
    const current = pets.find((p) => p.id === id);
    if (!current) throw new Error('Объявление не найдено');
    const updated = { ...current, status };
    pets = pets.map((p) => (p.id === id ? updated : p));
    return updated;
}
