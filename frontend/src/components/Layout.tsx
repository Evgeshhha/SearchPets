import { Link as RouterLink, Outlet } from 'react-router-dom'
import { AppBar, Box, Button, Container, GlobalStyles, Toolbar, Typography } from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets'
import AddIcon from '@mui/icons-material/Add'

export default function Layout() {
    return (
        <>
            <GlobalStyles styles={{ '@media print': { '.no-print': { display: 'none !important' } } }} />
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
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Box component="main">
                    <Outlet />
                </Box>
            </Container>
        </>
    );
}