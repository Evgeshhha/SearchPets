import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../../entities/user';

export default function RequireAuth() {
    const { status } = useAuth();
    const location = useLocation();

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }} role="status" aria-label="Проверка входа">
                <CircularProgress />
            </Box>
        );
    }
    if (status === 'anonymous') {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    return <Outlet />;
}
