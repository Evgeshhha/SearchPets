import { inputToIso } from '../../../shared/lib';
import type { Errors } from '../../../shared/lib';

export interface SightingFormValues extends Record<string, string> {
    place: string;
    seenAt: string; 
    comment: string;
    contact: string;
}

export const COMMENT_MAX = 2000;

export function validateSighting(v: SightingFormValues): Errors<SightingFormValues> {
    const errors: Errors<SightingFormValues> = {};

    const place = v.place.trim();
    if (!place) errors.place = 'Укажите, где вы видели питомца';
    else if (place.length > 255) errors.place = 'Не более 255 символов';

    if (!v.seenAt) errors.seenAt = 'Укажите дату и время';
    else if (Number.isNaN(new Date(v.seenAt).getTime())) errors.seenAt = 'Некорректная дата';
    else if (new Date(inputToIso(v.seenAt)) > new Date()) errors.seenAt = 'Время не может быть в будущем';

    if (v.comment.length > COMMENT_MAX) errors.comment = `Не более ${COMMENT_MAX} символов`;
    if (v.contact.trim().length > 100) errors.contact = 'Не более 100 символов';

    return errors;
}
