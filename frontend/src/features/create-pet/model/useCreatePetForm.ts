import { useMemo, useState } from 'react';
import { createPet } from '../../../entities/pet';
import { readFileAsDataUrl } from '../../../shared/lib';
import { FORM_FIELDS, INITIAL_VALUES, validatePetForm } from './validation';
import type { PetFormErrors, PetFormField, PetFormValues } from './validation';

export type SubmitResult = 'invalid' | 'saved' | 'failed';

export function useCreatePetForm() {
    const [values, setValues] = useState<PetFormValues>(INITIAL_VALUES);
    const [touched, setTouched] = useState<Partial<Record<PetFormField, boolean>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [createdId, setCreatedId] = useState<string | null>(null);

    const allErrors = useMemo(() => validatePetForm(values), [values]);

    const errors: PetFormErrors = {};
    for (const field of FORM_FIELDS) {
        if (touched[field] && allErrors[field]) errors[field] = allErrors[field];
    }

    const setValue = <K extends PetFormField>(field: K, value: PetFormValues[K]) =>
        setValues((prev) => ({ ...prev, [field]: value }));

    const touch = (field: PetFormField) => setTouched((prev) => ({ ...prev, [field]: true }));

    const submit = async (): Promise<SubmitResult> => {
        setTouched(Object.fromEntries(FORM_FIELDS.map((f) => [f, true])));
        if (Object.keys(allErrors).length > 0) return 'invalid';

        setSubmitting(true);
        setSubmitError(null);
        try {
            const photoUrl = values.photo ? await readFileAsDataUrl(values.photo) : undefined;
            const pet = await createPet({
                name: values.name.trim(),
                kind: values.kind,
                breed: values.breed.trim(),
                color: values.color.trim(),
                description: values.description.trim(),
                lastSeenPlace: values.lastSeenPlace.trim(),
                lastSeenDate: values.lastSeenDate,
                contactName: values.contactName.trim(),
                contactPhone: values.contactPhone.trim(),
                photoUrl,
            });
            setCreatedId(pet.id);
            return 'saved';
        } catch (e) {
            setSubmitError(e instanceof Error ? e.message : 'Не удалось сохранить объявление');
            return 'failed';
        } finally {
            setSubmitting(false);
        }
    };

    return { values, errors, setValue, touch, submit, submitting, submitError, createdId };
}
