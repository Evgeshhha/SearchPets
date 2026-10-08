import { useMemo, useState } from 'react';
import { Box, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { MOCK_PETS } from '../data/mock';
import PetCard from '../components/PetCard';
import { KIND_LABEL, STATUS_LABEL } from '../types';
import type { PetKind, PetStatus } from '../types';

export default function HomePage() {
    const [status, setStatus] = useState<PetStatus | ''>('');
    const [kind, setKind] = useState<PetKind | ''>('');

    const pets = useMemo(
        () => MOCK_PETS.filter((p) => (!status || p.status === status) && (!kind || p.kind === kind)),
        [status, kind],
    );

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Объявления о пропавших животных
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}
                sx={{
                    mb: 3,
                }}  >
                <TextField select label="Статус" value={status} onChange={(e) => setStatus(e.target.value as PetStatus | '')} sx={{ minWidth: 180 }}>
                    <MenuItem value="">Все</MenuItem>
                    {Object.entries(STATUS_LABEL).map(([k, v]) => (
                        <MenuItem key={k} value={k}>{v}</MenuItem>
                    ))}
                </TextField>
                <TextField select label="Вид" value={kind} onChange={(e) => setKind(e.target.value as PetKind | '')} sx={{ minWidth: 180 }}>
                    <MenuItem value="">Все</MenuItem>
                    {Object.entries(KIND_LABEL).map(([k, v]) => (
                        <MenuItem key={k} value={k}>{v}</MenuItem>
                    ))}
                </TextField>
            </Stack>
            <Box style={{ marginTop: 16 }}>
                <Grid container spacing={2} >
                    {pets.map((pet) => (
                        <Grid key={pet.id} size={{xs:12, sm:6, md:4}}>
                            <PetCard pet={pet} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {pets.length === 0 && <Typography color="text.secondary">Ничего не найдено</Typography>}
        </>
    );
}