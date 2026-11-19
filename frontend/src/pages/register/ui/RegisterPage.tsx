import { Navigate } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { useAuth } from '../../../entities/user';
import { RegisterForm } from '../../../features/auth';
import { Appear } from '../../../shared/ui';

export default function RegisterPage() {
    const { user } = useAuth();
    if (user) return <Navigate to="/" replace />;

    return (
        <Appear>
            <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 440, mx: 'auto' }}>
                <Typography variant="h5" gutterBottom>Регистрация</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    После регистрации вы сразу войдёте в приложение.
                </Typography>
                <RegisterForm />
            </Paper>
        </Appear>
    );
}
