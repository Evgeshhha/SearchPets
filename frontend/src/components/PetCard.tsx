import { Link as RouterLink } from 'react-router-dom'
import { Box, Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place'
import PetsIcon from '@mui/icons-material/Pets'
import { KIND_LABEL } from '../types'
import type { PetAd } from '../types'
import StatusChip from './StatusChip'

export default function PetCard({ pet }: { pet: PetAd }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardActionArea component={RouterLink} to={`/pets/${pet.id}`} sx={{ height: '100%' }}>
                {pet.photoUrl ? (
                    <CardMedia component="img" height="180" image={pet.photoUrl} alt={pet.name} />
                ) : (
                    <Box sx={{ height: 180, display: 'grid', placeItems: 'center', bgcolor: 'grey.200' }}>
                        <PetsIcon sx={{ fontSize: 64, color: 'grey.500' }} />
                    </Box>
                )}
                <CardContent sx={{ width: '100%', boxSizing: 'border-box' }}>
                    <Stack direction="row" sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }} >
                        <Typography variant="h6">{pet.name}</Typography>
                        <StatusChip status={pet.status} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        {KIND_LABEL[pet.kind]} · {pet.breed}
                    </Typography>
                    <Stack direction="row" spacing={0.5} 
                        sx={{
                            alignItems: 'center',
                            mt: 1,
                        }}>
                        <PlaceIcon fontSize="small" color="primary" />
                        <Typography variant="body2">{pet.lastSeenPlace}</Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}