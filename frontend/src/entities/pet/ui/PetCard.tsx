import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { KIND_LABEL } from '../model/types';
import type { PetAd } from '../model/types';
import PetPhoto from './PetPhoto';
import StatusChip from './StatusChip';

export default function PetCard({ pet }: { pet: PetAd }) {
    return (
        <Card
            sx={{
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
            }}
        >
            <CardActionArea component={RouterLink} to={`/pets/${pet.id}`} sx={{ height: '100%' }}>
                <PetPhoto src={pet.photoUrl} alt={pet.name} />
                <CardContent sx={{ width: '100%', boxSizing: 'border-box' }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">{pet.name}</Typography>
                        <StatusChip status={pet.status} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        {KIND_LABEL[pet.kind]} · {pet.breed || 'порода не указана'}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 1 }}>
                        <PlaceIcon fontSize="small" color="primary" />
                        <Typography variant="body2">{pet.lastSeenPlace}</Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
