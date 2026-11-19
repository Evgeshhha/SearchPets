import { Link as RouterLink } from 'react-router-dom'
import { Button, Stack, Typography } from '@mui/material'

export default function NotFoundPage() {
    return (
        <Stack sx={{ alignItems: "center", py: 8 }} spacing={2} >
            <Typography variant="h3">404</Typography>
            <Typography>Страница или объявление не найдены</Typography>
            <Button variant="contained" component={RouterLink} to="/">На главную</Button>
        </Stack>
    );
}