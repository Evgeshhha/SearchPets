import { PET_KINDS } from '../../../entities/pet';
import type { PetKind } from '../../../entities/pet';
import { todayIso } from '../../../shared/lib';

export interface PetFormValues {
    name: string;
    kind: PetKind;
    breed: string;
    color: string;
    description: string;
    lastSeenPlace: string;
    lastSeenDate: string;
    contactName: string;
    contactPhone: string;
    photo: File | null;
}

export type PetFormField = keyof PetFormValues;
export type PetFormErrors = Partial<Record<PetFormField, string>>;

export const INITIAL_VALUES: PetFormValues = {
    name: '',
    kind: 'dog',
    breed: '',
    color: '',
    description: '',
    lastSeenPlace: '',
    lastSeenDate: '',
    contactName: '',
    contactPhone: '',
    photo: null,
};

export const FORM_FIELDS = Object.keys(INITIAL_VALUES) as PetFormField[];

export const DESCRIPTION_MAX = 500;
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const PERSON_NAME = /^[\p{L}\s'-]+$/u;
const PHONE_FORMAT = /^\+?[0-9][0-9\s\-()]{5,28}$/;

export function validatePetForm(v: PetFormValues): PetFormErrors {
    const errors: PetFormErrors = {};

    const name = v.name.trim();
    if (!name) errors.name = 'Укажите кличку';
    else if (name.length < 2) errors.name = 'Минимум 2 символа';
    else if (name.length > 40) errors.name = 'Не более 40 символов';

    if (!PET_KINDS.includes(v.kind)) errors.kind = 'Выберите вид животного';

    if (v.breed.trim().length > 60) errors.breed = 'Не более 60 символов';

    const color = v.color.trim();
    if (!color) errors.color = 'Укажите окрас — это поможет узнать питомца';
    else if (color.length > 40) errors.color = 'Не более 40 символов';

    if (v.description.length > DESCRIPTION_MAX) {
        errors.description = `Не более ${DESCRIPTION_MAX} символов (сейчас ${v.description.length})`;
    }

    const place = v.lastSeenPlace.trim();
    if (!place) errors.lastSeenPlace = 'Укажите, где видели питомца в последний раз';
    else if (place.length < 3) errors.lastSeenPlace = 'Опишите место подробнее';
    else if (place.length > 120) errors.lastSeenPlace = 'Не более 120 символов';

    if (!v.lastSeenDate) errors.lastSeenDate = 'Укажите дату';
    else if (Number.isNaN(new Date(v.lastSeenDate).getTime())) errors.lastSeenDate = 'Некорректная дата';
    else if (v.lastSeenDate > todayIso()) errors.lastSeenDate = 'Дата не может быть в будущем';
    else if (v.lastSeenDate < '2000-01-01') errors.lastSeenDate = 'Слишком давняя дата';

    const contact = v.contactName.trim();
    if (!contact) errors.contactName = 'Укажите, как к вам обращаться';
    else if (contact.length < 2) errors.contactName = 'Минимум 2 символа';
    else if (contact.length > 40) errors.contactName = 'Не более 40 символов';
    else if (!PERSON_NAME.test(contact)) errors.contactName = 'Только буквы, пробел и дефис';

    const phone = v.contactPhone.trim();
    const digits = phone.replace(/\D/g, '');
    if (!phone) errors.contactPhone = 'Укажите телефон для связи';
    else if (!PHONE_FORMAT.test(phone)) errors.contactPhone = 'Номер начинается с цифры или «+»; допустимы цифры, пробелы, скобки и дефис';
    else if (digits.length < 10 || digits.length > 15) errors.contactPhone = 'Телефон должен содержать от 10 до 15 цифр';

    if (v.photo) {
        if (!PHOTO_TYPES.includes(v.photo.type)) errors.photo = 'Допустимые форматы: JPEG, PNG, WebP';
        else if (v.photo.size > PHOTO_MAX_BYTES) errors.photo = 'Размер файла не более 5 МБ';
    }

    return errors;
}
