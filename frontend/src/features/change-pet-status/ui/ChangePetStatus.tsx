import { useState } from 'react';
import { Alert, Collapse, Snackbar, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { PET_STATUSES, STATUS_LABEL, updatePetStatus } from '../../../entities/pet';
import type { PetAd, PetStatus } from '../../../entities/pet';

interface Props {
    pet: PetAd;
    onChanged: (updated: PetAd) => void;
}

export default function ChangePetStatus({ pet, onChanged }: Props) {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const handleChange = async (_: unknown, next: PetStatus | null) => {
        if (!next || next === pet.status) return;
        setPending(true);
        setError(null);
        try {
            onChanged(await updatePetStatus(pet.id, next));
            setSaved(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Не удалось обновить статус');
        } finally {
            setPending(false);
        }
    };

    return (
        <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">Статус поиска</Typography>
            <ToggleButtonGroup exclusive size="small" value={pet.status} disabled={pending} onChange={handleChange}>
                {PET_STATUSES.map((s) => (
                    <ToggleButton key={s} value={s} sx={{ px: 2 }}>
                        {STATUS_LABEL[s]}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <Collapse in={error !== null}>
                <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
            </Collapse>
            <Snackbar open={saved} autoHideDuration={2000} onClose={() => setSaved(false)} message="Статус обновлён" />
        </Stack>
    );
}
