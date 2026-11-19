import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Box, Button, FormHelperText, IconButton, Stack, Typography } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    file: File | null;
    error?: string;
    disabled?: boolean;
    onChange: (file: File | null) => void;
}

export default function PhotoPicker({ file, error, disabled, onChange }: Props) {
    const [preview, setPreview] = useState<string>();

    useEffect(() => {
        if (!file) {
            setPreview(undefined);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.files?.[0] ?? null);
        e.target.value = ''; 
    };

    return (
        <Box>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Button
                    component="label"
                    variant="outlined"
                    color={error ? 'error' : 'primary'}
                    disabled={disabled}
                    startIcon={<AddPhotoAlternateIcon />}
                    sx={{ height: 56, flexShrink: 0 }}
                >
                    {file ? 'Заменить фото' : 'Выбрать фото'}
                    <input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={handleSelect} />
                </Button>
                {file && (
                    <>
                        {preview && !error && (
                            <Box
                                component="img"
                                src={preview}
                                alt="Предпросмотр фото"
                                sx={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 1 }}
                            />
                        )}
                        <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>{file.name}</Typography>
                        <IconButton aria-label="Убрать фото" disabled={disabled} onClick={() => onChange(null)}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                )}
            </Stack>
            <FormHelperText error={Boolean(error)}>
                {error ?? 'Необязательно. JPEG, PNG или WebP, до 5 МБ'}
            </FormHelperText>
        </Box>
    );
}
