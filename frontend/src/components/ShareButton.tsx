import { useState } from 'react'
import { Button, Snackbar } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'

interface Props {
    title: string;
    url?: string;
}

export default function ShareButton({ title, url = window.location.href }: Props) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch {
            }
        }
        await navigator.clipboard.writeText(url);
        setCopied(true);
    };

    return (
        <>
            <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleShare}>
                Поделиться
            </Button>
            <Snackbar
                open={copied}
                autoHideDuration={2500}
                onClose={() => setCopied(false)}
                message="Ссылка скопирована"
            />
        </>
    );
}