import { Link as RouterLink, useParams } from 'react-router-dom'
import { Box, Button, Card, CardMedia, Grid, Stack, Typography } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import { getPetById } from '../data/mock'
import { KIND_LABEL } from '../types'
import StatusChip from '../components/StatusChip'
import ShareButton from '../components/ShareButton.tsx'
import NotFoundPage from './NotFoundPage.tsx'

export default function PetDetailsPage() {
    const { id } = useParams();
    const pet = getPetById(id);
    if (!pet) return <NotFoundPage />;

    return (
        <Grid container spacing={3}>
            <Grid sx={{ xs: 12, md: 6 }}  >
                <Card>
                    {pet.photoUrl ? (
                        <CardMedia component="img" image={pet.photoUrl} alt={pet.name} />
                    ) : (
                        <Box sx={{ height: 300, bgcolor: 'grey.200' }} />
                    )}
                </Card>
            </Grid>
            <Grid sx={{ xs: 12, md: 6 }}  >
                <Stack spacing={1.5}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <Typography variant="h4">{pet.name}</Typography>
                        <StatusChip status={pet.status} />
                    </Stack>
                    <Typography>{KIND_LABEL[pet.kind]}, {pet.breed}, {pet.color}</Typography>
                    <Typography><b>Где видели:</b> {pet.lastSeenPlace}</Typography>
                    <Typography><b>Когда:</b> {new Date(pet.lastSeenDate).toLocaleDateString('ru-RU')}</Typography>
                    <Typography>{pet.description}</Typography>
                    <Typography><b>Контакт:</b> {pet.contactName}, {pet.contactPhone}</Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                        <ShareButton title={`Пропал питомец: ${pet.name}`} />
                        <Button variant="contained" startIcon={<PrintIcon />} component={RouterLink} to={`/pets/${pet.id}/flyer`}>
                            Листовка
                        </Button>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    );
}