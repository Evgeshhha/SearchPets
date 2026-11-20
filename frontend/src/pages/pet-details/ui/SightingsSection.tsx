import { useState } from 'react';
import { Alert, Button, Divider, Paper, Skeleton, Stack, Typography } from '@mui/material';
import type { PetAd } from '../../../entities/pet';
import { deleteSighting, fetchSightings, SightingList } from '../../../entities/sighting';
import type { Sighting } from '../../../entities/sighting';
import { SightingForm } from '../../../features/report-sighting';
import { useAsync } from '../../../shared/lib';

interface Props {
    pet: PetAd;
    canManage: boolean;
}

const byNewest = (a: Sighting, b: Sighting) => Date.parse(b.seenAt) - Date.parse(a.seenAt);

export default function SightingsSection({ pet, canManage }: Props) {
    const { state, reload, setData } = useAsync(() => fetchSightings(pet.id), [pet.id]);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCreated = (created: Sighting) => {
        if (state.status === 'success') setData([...state.data, created].sort(byNewest));
    };

    const handleDelete = async (sighting: Sighting) => {
        setBusyId(sighting.id);
        setError(null);
        try {
            await deleteSighting(pet.id, sighting.id);
            if (state.status === 'success') setData(state.data.filter((s) => s.id !== sighting.id));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Не удалось удалить отметку');
        } finally {
            setBusyId(null);
        }
    };

    const renderList = () => {
        if (state.status === 'loading') {
            return (
                <Stack spacing={1} aria-busy="true" aria-label="Загрузка отметок">
                    <Skeleton height={48} />
                    <Skeleton height={48} />
                </Stack>
            );
        }
        if (state.status === 'error') {
            return (
                <Alert severity="error" action={<Button color="inherit" onClick={reload}>Повторить</Button>}>
                    {state.message}
                </Alert>
            );
        }
        if (state.data.length === 0) {
            return <Typography color="text.secondary">Пока никто не сообщал, что видел питомца.</Typography>;
        }
        return (
            <SightingList
                sightings={state.data}
                onDelete={canManage ? handleDelete : undefined}
                busyId={busyId}
            />
        );
    };

    return (
        <Stack spacing={2} sx={{ mt: 4 }} component="section" aria-labelledby="sightings-title">
            <Typography id="sightings-title" variant="h5">Видели этого питомца?</Typography>
            {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
            {renderList()}
            <Divider />
            {pet.status === 'closed' ? (
                <Alert severity="info">Объявление закрыто — новые отметки не принимаются.</Alert>
            ) : (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Сообщить о находке</Typography>
                    <SightingForm announcementId={pet.id} onCreated={handleCreated} />
                </Paper>
            )}
        </Stack>
    );
}
