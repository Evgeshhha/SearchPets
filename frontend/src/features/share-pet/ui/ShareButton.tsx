import { useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { fetchShareInfo } from '../../../entities/pet';

interface Props {
    petId: string;
    title: string;
}

export default function ShareButton({ petId, title }: Props) {
    const [message, setMessage] = useState<string | null>(null);

    const handleShare = async () => {
        let info = { title, text: '', url: window.location.href };
        try {
            info = await fetchShareInfo(petId);
        } catch {
        }

        if (navigator.share) {
            try {
                await navigator.share(info);
                return;
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') return;
            }
        }
        try {
            await navigator.clipboard.writeText(info.url);
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