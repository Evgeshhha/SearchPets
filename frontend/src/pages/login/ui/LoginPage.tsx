import { Navigate, useLocation } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { useAuth } from '../../../entities/user';
import { LoginForm } from '../../../features/auth';
import { Appear } from '../../../shared/ui';

export default function LoginPage() {
    const { user } = useAuth();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from ?? '/';

    if (user) return <Navigate to={from} replace />;

    return (
        <Appear>
            <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 440, mx: 'auto' }}>
                <Typography variant="h5" gutterBottom>Вход</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Войдите, чтобы публиковать объявления и управлять ими.
                </Typography>
                <LoginForm />
            </Paper>
        </Appear>
    );
}
