import { useMemo, useState } from 'react';
import { createPet, updatePet } from '../../../entities/pet';
import type { NewPetInput, PetAd, PhotoChange } from '../../../entities/pet';
import { ApiError } from '../../../shared/api';
import { FORM_FIELDS, INITIAL_VALUES, validatePetForm } from './validation';
import type { PetFormErrors, PetFormField, PetFormValues } from './validation';

export type SubmitResult = 'invalid' | 'saved' | 'failed';

/** Путь поля в ответе сервера (ошибка 422) → поле формы. */
const SERVER_FIELDS: Record<string, PetFormField> = {
    'pet.name': 'name',
    'pet.kind': 'kind',
    'pet.breed': 'breed',
    'pet.color': 'color',
    'pet.description': 'description',
    last_seen_place: 'lastSeenPlace',
    last_seen_at: 'lastSeenDate',
    contact_name: 'contactName',
    contact_phone: 'contactPhone',
};

const initialValues = (pet: PetAd | undefined, defaultContactName: string): PetFormValues =>
    pet
        ? {
              name: pet.name,
              kind: pet.kind,
              breed: pet.breed,
              color: pet.color,
              description: pet.description,
              lastSeenPlace: pet.lastSeenPlace,
              lastSeenDate: pet.lastSeenDate,
              contactName: pet.contactName,
              contactPhone: pet.contactPhone,
              photo: null,
          }
        : { ...INITIAL_VALUES, contactName: defaultContactName };

/** Состояние формы объявления. Если передан `pet` — это редактирование, иначе создание. */
export function usePetForm(pet?: PetAd, defaultContactName = '') {
    const [values, setValues] = useState<PetFormValues>(() => initialValues(pet, defaultContactName));
    const [touched, setTouched] = useState<Partial<Record<PetFormField, boolean>>>({});
    const [serverErrors, setServerErrors] = useState<PetFormErrors>({});
    const [removePhoto, setRemovePhoto] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [savedId, setSavedId] = useState<string | null>(null);

    const allErrors = useMemo(() => validatePetForm(values), [values]);

    // Ошибка поля показывается после того, как пользователь его покинул (или нажал «Сохранить»);
    // ошибка от сервера — сразу, пока поле не изменено
    const errors: PetFormErrors = {};
    for (const field of FORM_FIELDS) {
        const message = (touched[field] && allErrors[field]) || serverErrors[field];
        if (message) errors[field] = message;
    }

    const setValue = <K extends PetFormField>(field: K, value: PetFormValues[K]) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        setServerErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const touch = (field: PetFormField) => setTouched((prev) => ({ ...prev, [field]: true }));

    const submit = async (): Promise<SubmitResult> => {
        setTouched(Object.fromEntries(FORM_FIELDS.map((f) => [f, true])));
        if (Object.values(allErrors).some(Boolean)) return 'invalid';

        const input: NewPetInput = {
            name: values.name.trim(),
            kind: values.kind,
            breed: values.breed.trim(),
            color: values.color.trim(),
            description: values.description.trim(),
            lastSeenPlace: values.lastSeenPlace.trim(),
            lastSeenDate: values.lastSeenDate,
            contactName: values.contactName.trim(),
            contactPhone: values.contactPhone.trim(),
        };

        setSubmitting(true);
        setSubmitError(null);
        try {
            let saved: PetAd;
            if (pet) {
                const photo: PhotoChange = values.photo
                    ? { kind: 'replace', file: values.photo }
                    : removePhoto
                      ? { kind: 'remove' }
                      : { kind: 'keep' };
                saved = await updatePet(pet.id, input, photo);
            } else {
                saved = await createPet(input, values.photo);
            }
            setSavedId(saved.id);
            return 'saved';
        } catch (error) {
            if (error instanceof ApiError) {
                const mapped: PetFormErrors = {};
                for (const [path, text] of Object.entries(error.fields)) {
                    const field = SERVER_FIELDS[path];
                    if (field) mapped[field] = text;
                }
                setServerErrors(mapped);
            }
            setSubmitError(error instanceof Error ? error.message : 'Не удалось сохранить объявление');
            return 'failed';
        } finally {
            setSubmitting(false);
        }
    };

    return {
        values,
        errors,
        setValue,
        touch,
        submit,
        submitting,
        submitError,
        savedId,
        removePhoto,
        setRemovePhoto,
        currentPhotoUrl: pet?.photoUrl,
    };
}
