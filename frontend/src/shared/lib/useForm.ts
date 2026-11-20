import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ApiError } from '../api';

export type Errors<V> = Partial<Record<keyof V, string>>;

interface Options<V> {
    serverFields?: Record<string, keyof V & string>;
    resetOnSuccess?: boolean;
}

export function useForm<V extends Record<string, string>>(
    initial: V,
    validate: (values: V) => Errors<V>,
    onSubmit: (values: V) => Promise<void>,
    { serverFields = {}, resetOnSuccess = false }: Options<V> = {},
) {
    const [values, setValues] = useState<V>(initial);
    const [touched, setTouched] = useState<Partial<Record<keyof V, boolean>>>({});
    const [serverErrors, setServerErrors] = useState<Errors<V>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const allErrors = validate(values);
    const keys = Object.keys(initial) as (keyof V & string)[];

    const field = (name: keyof V & string) => {
        const message = (touched[name] && allErrors[name]) || serverErrors[name];
        return {
            name,
            value: values[name],
            disabled: submitting,
            error: Boolean(message),
            helperText: message || undefined,
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setValues((prev) => ({ ...prev, [name]: e.target.value }));
                setServerErrors((prev) => ({ ...prev, [name]: undefined }));
                setSubmitError(null);
            },
            onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
        };
    };

    const reset = () => {
        setValues(initial);
        setTouched({});
        setServerErrors({});
        setSubmitError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        setTouched(
            Object.fromEntries(keys.map((k) => [k, true])) as Partial<
                Record<keyof V, boolean>
            >
        );        
        if (Object.values(allErrors).some(Boolean)) {
            requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
            return;
        }

        setSubmitting(true);
        setSubmitError(null);
        try {
            await onSubmit(values);
            if (resetOnSuccess) reset();
        } catch (error) {
            if (error instanceof ApiError) {
                const mapped: Errors<V> = {};
                for (const [path, text] of Object.entries(error.fields)) {
                    const name = serverFields[path];
                    if (name) mapped[name] = text;
                }
                setServerErrors(mapped);
            }
            setSubmitError(error instanceof Error ? error.message : 'Не удалось выполнить запрос');
        } finally {
            setSubmitting(false);
        }
    };

    return { values, field, handleSubmit, reset, submitting, submitError };
}
