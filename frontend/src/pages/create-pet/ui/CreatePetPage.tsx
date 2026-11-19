import { useNavigate } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { CreatePetForm } from '../../../features/create-pet';
import { Appear } from '../../../shared/ui';

export default function CreatePetPage() {
    const navigate = useNavigate();

    return (
        <Appear>
            <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 720, mx: 'auto' }}>
                <Typography variant="h5" gutterBottom>Новое объявление</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Поля со звёздочкой обязательны для заполнения.
                </Typography>
                <CreatePetForm onCreated={(id) => navigate(`/pets/${id}`)} />
            </Paper>
        </Appear>
    );
}
