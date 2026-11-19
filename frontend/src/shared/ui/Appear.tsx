import type { ReactNode } from 'react';
import { Box, Fade } from '@mui/material';

interface Props {
    children: ReactNode;
    delay?: number;
    fullHeight?: boolean;
}

export default function Appear({ children, delay = 0, fullHeight = false }: Props) {
    return (
        <Fade in appear timeout={400} style={{ transitionDelay: `${delay}ms` }}>
            <Box sx={fullHeight ? { height: '100%' } : undefined}>{children}</Box>
        </Fade>
    );
}
