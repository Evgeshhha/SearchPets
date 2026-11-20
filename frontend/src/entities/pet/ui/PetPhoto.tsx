import { useState } from 'react';
import { Box } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

interface Props {
    src?: string;
    alt: string;
    height?: number | Record<string, number>;
}

export default function PetPhoto({ src, alt, height = 180 }: Props) {
    const [failedSrc, setFailedSrc] = useState<string>();
    if (!src || failedSrc === src) {
        return (
            <Box sx={{ height, display: 'grid', placeItems: 'center', bgcolor: 'grey.200' }} aria-label={alt}>
                <PetsIcon sx={{ fontSize: 64, color: 'grey.500' }} />
            </Box>
        );
    }
    return (
        <Box
            component="img"
            src={src}
            alt={alt}
            onError={() => setFailedSrc(src)}
            sx={{ display: 'block', width: '100%', height, objectFit: 'cover' }}
        />
    );
}