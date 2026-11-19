import { Link as RouterLink } from 'react-router-dom';
import { Alert, Button, Collapse, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../../../entities/user';
import { useAuthForm } from '../model/useAuthForm';
import { validateEmail } from '../model/validation';

export default function LoginForm() {
    const { login } = useAuth();
    const form = useAuthForm(
        { email: '', password: '' },
        (v) => ({
            email: validateEmail(v.email),
            password: v.password ? undefined : 'Введите пароль',
        }),
        (v) => login(v.email.trim(), v.password),
    );

    return (
        <form onSubmit={form.handleSubmit} noValidate>
            <Stack spacing={2}>
                <TextField label="Email" type="email" autoComplete="email" fullWidth autoFocus {...form.field('email')} />
                <TextField
                    label="Пароль"
                    type="password"
                    autoComplete="current-password"
                    fullWidth
                    {...form.field('password')}
                />
                <Collapse in={form.submitError !== null}>
                    <Alert severity="error">{form.submitError}</Alert>
                </Collapse>
                <Button type="submit" variant="contained" size="large" disabled={form.submitting}>
                    {form.submitting ? 'Входим…' : 'Войти'}
                </Button>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Нет аккаунта?{' '}
                    <Link component={RouterLink} to="/register">
                        Зарегистрироваться
                    </Link>
                </Typography>
            </Stack>
        </form>
    );
}
