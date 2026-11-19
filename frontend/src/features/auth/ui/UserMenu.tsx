import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../../entities/user';

export default function UserMenu() {
    const { status, user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    if (status === 'loading') return null;

    if (!user) {
        return (
            <>
                <Button color="inherit" component={RouterLink} to="/login">Войти</Button>
                <Button color="inherit" component={RouterLink} to="/register">Регистрация</Button>
            </>
        );
    }

    const handleLogout = async () => {
        setAnchor(null);
        await logout();
        navigate('/');
    };

    return (
        <>
            <Button color="inherit" startIcon={<AccountCircleIcon />} onClick={(e) => setAnchor(e.currentTarget)}>
                {user.name}
            </Button>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
                    {user.email}
                </Typography>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                    Выйти
                </MenuItem>
            </Menu>
        </>
    );
}
