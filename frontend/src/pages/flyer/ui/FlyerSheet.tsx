import { Box, Paper, Typography } from '@mui/material';
import { KIND_LABEL, PetPhoto } from '../../../entities/pet';
import type { PetAd } from '../../../entities/pet';
import type { FlyerTemplate } from '../../../entities/flyer-template';
import { contrastText, formatDate } from '../../../shared/lib';

const COLOR_TRANSITION = 'background-color 0.3s ease';

export default function FlyerSheet({ pet, template }: { pet: PetAd; template: FlyerTemplate }) {
    return (
        <Paper sx={{ maxWidth: 595, width: '100%', bgcolor: template.backgroundColor, overflow: 'hidden', transition: COLOR_TRANSITION }}>
            <Box
                sx={{
                    bgcolor: template.headerColor,
                    color: contrastText(template.headerColor),
                    p: 2,
                    textAlign: 'center',
                    transition: COLOR_TRANSITION,
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: 800 }}>ПРОПАЛ ПИТОМЕЦ</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
                {pet.photoUrl && (
                    <Box sx={{ mb: 2, maxHeight: 320, overflow: 'hidden' }}>
                        <PetPhoto src={pet.photoUrl} alt={pet.name} height={320} />
                    </Box>
                )}
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{pet.name}</Typography>
                <Typography variant="h6">
                    {[KIND_LABEL[pet.kind], pet.breed, pet.color].filter(Boolean).join(', ')}
                </Typography>
                {pet.description && <Typography sx={{ mt: 1 }}>{pet.description}</Typography>}
                <Typography sx={{ mt: 1 }}>
                    <b>Пропал:</b> {pet.lastSeenPlace}, {formatDate(pet.lastSeenDate)}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 3, textAlign: 'center' }}>
                    {pet.contactName}: {pet.contactPhone}
                </Typography>
            </Box>
        </Paper>
    );
}
