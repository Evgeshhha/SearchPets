import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '../styles/theme';

export default function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>{children}</BrowserRouter>
        </ThemeProvider>
    );
}
