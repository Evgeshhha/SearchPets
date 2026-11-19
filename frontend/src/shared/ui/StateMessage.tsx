import type { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

interface Props {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    role?: 'status' | 'alert';
}

/** Универсальный блок для состояний «пусто» и «ошибка». */
export default function StateMessage({ icon, title, description, action, role = 'status' }: Props) {
    return (
        <Stack spacing={1.5} role={role} sx={{ alignItems: 'center', textAlign: 'center', py: 8 }}>
            {icon}
            <Typography variant="h6">{title}</Typography>
            {description && (
                <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
                    {description}
                </Typography>
            )}
            {action}
        </Stack>
    );
}
