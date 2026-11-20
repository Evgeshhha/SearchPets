import { Alert, Button, Collapse, Stack, TextField } from '@mui/material';
import { createSighting } from '../../../entities/sighting';
import type { Sighting } from '../../../entities/sighting';
import { inputToIso, nowForInput, useForm } from '../../../shared/lib';
import { COMMENT_MAX, validateSighting } from '../model/validation';
import type { SightingFormValues } from '../model/validation';

interface Props {
    announcementId: string;
    onCreated: (sighting: Sighting) => void;
}

const INITIAL: SightingFormValues = { place: '', seenAt: '', comment: '', contact: '' };

export default function SightingForm({ announcementId, onCreated }: Props) {
    const form = useForm(
        INITIAL,
        validateSighting,
        async (v) => {
            const created = await createSighting(announcementId, {
                place: v.place,
                seenAt: inputToIso(v.seenAt),
                comment: v.comment,
                contact: v.contact,
            });
            onCreated(created);
        },
        {
            serverFields: { place: 'place', seen_at: 'seenAt', comment: 'comment', contact: 'contact' },
            resetOnSuccess: true,
        },
    );

    return (
        <form onSubmit={form.handleSubmit} noValidate>
            <Stack spacing={2}>
                <TextField required fullWidth label="Где вы видели питомца" {...form.field('place')} />
                <TextField
                    required
                    fullWidth
                    type="datetime-local"
                    label="Когда"
                    {...form.field('seenAt')}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: nowForInput() } }}
                />
                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Комментарий"
                    {...form.field('comment')}
                    helperText={form.field('comment').helperText ?? `${form.values.comment.length}/${COMMENT_MAX}`}
                />
                <TextField
                    fullWidth
                    label="Как с вами связаться (необязательно)"
                    {...form.field('contact')}
                />
                <Collapse in={form.submitError !== null}>
                    <Alert severity="error">{form.submitError}</Alert>
                </Collapse>
                <Button type="submit" variant="contained" disabled={form.submitting} sx={{ alignSelf: 'flex-start' }}>
                    {form.submitting ? 'Отправляем…' : 'Сообщить'}
                </Button>
            </Stack>
        </form>
    );
}
