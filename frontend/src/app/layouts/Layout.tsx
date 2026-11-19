import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { AppBar, Box, Button, Container, Fade, GlobalStyles, Toolbar, Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import AddIcon from '@mui/icons-material/Add';
import { UserMenu } from '../../features/auth';

const globalStyles = {
    '@media print': { '.no-print': { display: 'none !important' } },
    '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            transitionDuration: '0.01ms !important',
            transitionDelay: '0ms !important',
        },
    },
};

export default function Layout() {
    const { pathname } = useLocation();
    return (
        <>
            <GlobalStyles styles={globalStyles} />
            <AppBar position="static" className="no-print">
                <Toolbar>
                    <PetsIcon sx={{ mr: 1 }} />
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
                    >
                        Найдись, друг!
                    </Typography>
                    <Button color="inherit" component={RouterLink} to="/pets/new" startIcon={<AddIcon />}>
                        Подать объявление
                    </Button>
                    <UserMenu />
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Fade key={pathname} in appear timeout={300}>
                    <Box component="main">
                        <Outlet />
                    </Box>
                </Fade>
            </Container>
        </>
    );
}
