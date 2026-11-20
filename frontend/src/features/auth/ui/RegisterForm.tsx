import { Link as RouterLink } from 'react-router-dom';
import { Alert, Button, Collapse, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../../../entities/user';
import { useForm } from '../../../shared/lib';
import { validateEmail, validateNewPassword, validatePersonName } from '../model/validation';

export default function RegisterForm() {
    const { register } = useAuth();
    const form = useForm(
        { name: '', email: '', password: '', confirm: '' },
        (v) => ({
            name: validatePersonName(v.name),
            email: validateEmail(v.email),
            password: validateNewPassword(v.password),
            confirm: v.confirm !== v.password ? 'Пароли не совпадают' : undefined,
        }),
        (v) => register({ name: v.name.trim(), email: v.email.trim(), password: v.password }),
        { serverFields: { name: 'name', email: 'email', password: 'password' } },
    );

    return (
        <form onSubmit={form.handleSubmit} noValidate>
            <Stack spacing={2}>
                <TextField label="Имя" autoComplete="name" fullWidth autoFocus {...form.field('name')} />
                <TextField label="Email" type="email" autoComplete="email" fullWidth {...form.field('email')} />
                <TextField
                    label="Пароль"
                    type="password"
                    autoComplete="new-password"
                    fullWidth
                    {...form.field('password')}
                    helperText={form.field('password').helperText ?? 'Не менее 8 символов, буквы и цифры'}
                />
                <TextField
                    label="Повторите пароль"
                    type="password"
                    autoComplete="new-password"
                    fullWidth
                    {...form.field('confirm')}
                />
                <Collapse in={form.submitError !== null}>
                    <Alert severity="error">{form.submitError}</Alert>
                </Collapse>
                <Button type="submit" variant="contained" size="large" disabled={form.submitting}>
                    {form.submitting ? 'Регистрируем…' : 'Зарегистрироваться'}
                </Button>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Уже есть аккаунт?{' '}
                    <Link component={RouterLink} to="/login">
                        Войти
                    </Link>
                </Typography>
            </Stack>
        </form>
    );
}
