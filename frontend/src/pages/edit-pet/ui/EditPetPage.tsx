import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Button, Paper, Skeleton, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { canManagePet, fetchPet } from '../../../entities/pet';
import { useAuth } from '../../../entities/user';
import { PetForm } from '../../../features/pet-form';
import { useAsync } from '../../../shared/lib';
import { Appear, ErrorState, StateMessage } from '../../../shared/ui';
import { NotFoundPage } from '../../not-found';

export default function EditPetPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { state, reload } = useAsync(() => fetchPet(id), [id]);

    if (state.status === 'loading') {
        return (
            <Skeleton
                variant="rectangular"
                height={480}
                sx={{ maxWidth: 720, mx: 'auto', borderRadius: 2 }}
                aria-busy="true"
            />
        );
    }
    if (state.status === 'error') return <ErrorState message={state.message} onRetry={reload} />;

    const pet = state.data;
    if (!pet) return <NotFoundPage />;

    if (!canManagePet(pet, user)) {
        return (
            <StateMessage
                role="alert"
                icon={<LockIcon sx={{ fontSize: 56, color: 'text.disabled' }} />}
                title="Нет прав на редактирование"
                description="Изменять объявление может только его автор."
                action={
                    <Button variant="contained" component={RouterLink} to={`/pets/${pet.id}`}>
                        К объявлению
                    </Button>
                }
            />
        );
    }

    return (
        <Appear>
            <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 720, mx: 'auto' }}>
                <Typography variant="h5" gutterBottom>Редактирование объявления</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Поля со звёздочкой обязательны для заполнения.
                </Typography>
                <PetForm pet={pet} onSaved={(savedId) => navigate(`/pets/${savedId}`)} />
            </Paper>
        </Appear>
    );
}
