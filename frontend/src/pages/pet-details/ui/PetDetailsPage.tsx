import { Link as RouterLink, useParams } from 'react-router-dom';
import { Button, Card, Grid, Skeleton, Stack, Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { fetchPet, KIND_LABEL, PetPhoto, StatusChip } from '../../../entities/pet';
import { ChangePetStatus } from '../../../features/change-pet-status';
import { ShareButton } from '../../../features/share-pet';
import { formatDate, useAsync } from '../../../shared/lib';
import { Appear, ErrorState } from '../../../shared/ui';
import { NotFoundPage } from '../../not-found';

function DetailsSkeleton() {
    return (
        <Grid container spacing={3} aria-busy="true" aria-label="Загрузка объявления">
            <Grid size={{ xs: 12, md: 6 }}>
                <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Skeleton width="50%" height={48} />
                <Skeleton width="70%" />
                <Skeleton width="60%" />
                <Skeleton width="40%" />
                <Skeleton height={80} />
            </Grid>
        </Grid>
    );
}

export default function PetDetailsPage() {
    const { id } = useParams();
    const { state, reload, setData } = useAsync(() => fetchPet(id), [id]);

    if (state.status === 'loading') return <DetailsSkeleton />;
    if (state.status === 'error') return <ErrorState message={state.message} onRetry={reload} />;

    const pet = state.data;
    if (!pet) return <NotFoundPage />;

    return (
        <Appear>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <PetPhoto src={pet.photoUrl} alt={pet.name} height={{ xs: 240, md: 360 }} />
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={1.5}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                            <Typography variant="h4">{pet.name}</Typography>
                            <StatusChip status={pet.status} />
                        </Stack>
                        <Typography>
                            {[KIND_LABEL[pet.kind], pet.breed, pet.color].filter(Boolean).join(', ')}
                        </Typography>
                        <Typography><b>Где видели:</b> {pet.lastSeenPlace}</Typography>
                        <Typography><b>Когда:</b> {formatDate(pet.lastSeenDate)}</Typography>
                        {pet.description && <Typography>{pet.description}</Typography>}
                        <Typography><b>Контакт:</b> {pet.contactName}, {pet.contactPhone}</Typography>

                        <ChangePetStatus pet={pet} onChanged={setData} />

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                            <ShareButton title={`Пропал питомец: ${pet.name}`} />
                            <Button
                                variant="contained"
                                startIcon={<PrintIcon />}
                                component={RouterLink}
                                to={`/pets/${pet.id}/flyer`}
                            >
                                Листовка
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Appear>
    );
}