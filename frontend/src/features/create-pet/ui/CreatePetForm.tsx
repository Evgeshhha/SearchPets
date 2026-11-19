import { useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Alert, Button, CircularProgress, Collapse, Grid, MenuItem, TextField } from '@mui/material';
import { KIND_LABEL, PET_KINDS } from '../../../entities/pet';
import type { PetKind } from '../../../entities/pet';
import { todayIso } from '../../../shared/lib';
import { useCreatePetForm } from '../model/useCreatePetForm';
import { DESCRIPTION_MAX } from '../model/validation';
import type { PetFormValues } from '../model/validation';
import PhotoPicker from './PhotoPicker';

type TextFieldName = Exclude<keyof PetFormValues, 'photo'>;

interface Props {
    onCreated: (id: string) => void;
}

const REDIRECT_DELAY_MS = 1200;

export default function CreatePetForm({ onCreated }: Props) {
    const form = useCreatePetForm();
    const formRef = useRef<HTMLFormElement>(null);
    const busy = form.submitting || form.createdId !== null;

    useEffect(() => {
        if (!form.createdId) return;
        const id = form.createdId;
        const timer = setTimeout(() => onCreated(id), REDIRECT_DELAY_MS);
        return () => clearTimeout(timer);
    }, [form.createdId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const result = await form.submit();
        if (result === 'invalid') {
            requestAnimationFrame(() => {
                formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
            });
        }
    };

    const field = (name: TextFieldName) => ({
        name,
        value: form.values[name],
        disabled: busy,
        error: Boolean(form.errors[name]),
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            form.setValue(name, e.target.value as never),
        onBlur: () => form.touch(name),
    });
    const help = (name: TextFieldName, hint?: string) => form.errors[name] ?? hint;

    return (
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField required fullWidth label="Кличка" {...field('name')} helperText={help('name')} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        required
                        fullWidth
                        label="Вид"
                        {...field('kind')}
                        onChange={(e) => form.setValue('kind', e.target.value as PetKind)}
                        helperText={help('kind')}
                    >
                        {PET_KINDS.map((k) => <MenuItem key={k} value={k}>{KIND_LABEL[k]}</MenuItem>)}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth label="Порода" {...field('breed')} helperText={help('breed')} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField required fullWidth label="Окрас" {...field('color')} helperText={help('color')} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Приметы и описание"
                        {...field('description')}
                        helperText={help('description', `${form.values.description.length}/${DESCRIPTION_MAX}`)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        required
                        fullWidth
                        label="Место, где видели в последний раз"
                        {...field('lastSeenPlace')}
                        helperText={help('lastSeenPlace')}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        required
                        fullWidth
                        type="date"
                        label="Дата"
                        {...field('lastSeenDate')}
                        helperText={help('lastSeenDate')}
                        slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: todayIso() } }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        required
                        fullWidth
                        label="Имя контактного лица"
                        autoComplete="name"
                        {...field('contactName')}
                        helperText={help('contactName')}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        required
                        fullWidth
                        type="tel"
                        label="Телефон"
                        placeholder="+7 900 000-00-00"
                        autoComplete="tel"
                        {...field('contactPhone')}
                        helperText={help('contactPhone')}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <PhotoPicker
                        file={form.values.photo}
                        error={form.errors.photo}
                        disabled={busy}
                        onChange={(file) => {
                            form.setValue('photo', file);
                            form.touch('photo');
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Collapse in={form.submitError !== null}>
                        <Alert severity="error">{form.submitError}</Alert>
                    </Collapse>
                    <Collapse in={form.createdId !== null}>
                        <Alert severity="success">Объявление опубликовано. Переходим к карточке…</Alert>
                    </Collapse>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={busy}
                        startIcon={form.submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                    >
                        {form.submitting ? 'Публикуем…' : 'Опубликовать'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
