import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Errors } from './validation';

export function useAuthForm<V extends Record<string, string>>(
    initial: V,
    validate: (values: V) => Errors<V>,
    onSubmit: (values: V) => Promise<void>,
) {
    const [values, setValues] = useState<V>(initial);
    const [touched, setTouched] = useState<Partial<Record<keyof V, boolean>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const allErrors = validate(values);
    const keys = Object.keys(initial) as (keyof V & string)[];

    const field = (name: keyof V & string) => ({
        name,
        value: values[name],
        disabled: submitting,
        error: Boolean(touched[name] && allErrors[name]),
        helperText: touched[name] ? allErrors[name] : undefined,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
            setValues((prev) => ({ ...prev, [name]: e.target.value }));
            setSubmitError(null);
        },
        onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setTouched(
            Object.fromEntries(keys.map((k) => [k, true])) as Partial<Record<keyof V, boolean>>
        );
        if (Object.values(allErrors).some(Boolean)) return;

        setSubmitting(true);
        setSubmitError(null);
        try {
            await onSubmit(values);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Не удалось выполнить запрос');
        } finally {
            setSubmitting(false);
        }
    };

    return { field, handleSubmit, submitting, submitError };
}
