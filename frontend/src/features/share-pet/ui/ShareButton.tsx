import { useState } from 'react'
import { Button, Snackbar } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'

interface Props {
    title: string;
    url?: string;
}

export default function ShareButton({ title, url = window.location.href }: Props) {
    const [message, setMessage] = useState<string | null>(null);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') return;
            }
        }
        await navigator.clipboard.writeText(url);
        try {
            await navigator.clipboard.writeText(url);
            setMessage('Ссылка скопирована');
        } catch {
            setMessage('Не удалось скопировать ссылку');
        }
    };

    return (
        <>
            <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleShare}>
                Поделиться
            </Button>
            <Snackbar
                open={message !== null}
                autoHideDuration={2500}
                onClose={() => setMessage(null)}
                message={message}
            />
        </>
    );
}