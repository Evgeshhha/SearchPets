import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Box, Button, FormHelperText, IconButton, Stack, Typography } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    file: File | null;
    error?: string;
    disabled?: boolean;
    currentUrl?: string;
    removeCurrent?: boolean;
    onChange: (file: File | null) => void;
    onRemoveCurrentChange?: (remove: boolean) => void;
}

const thumbSx = { width: 56, height: 56, objectFit: 'cover', borderRadius: 1 } as const;

export default function PhotoPicker({
    file,
    error,
    disabled,
    currentUrl,
    removeCurrent = false,
    onChange,
    onRemoveCurrentChange,
}: Props) {
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
        onRemoveCurrentChange?.(false);
        e.target.value = ''; 
    };

    const hasCurrent = Boolean(currentUrl) && !file;

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
                    {file || hasCurrent ? 'Заменить фото' : 'Выбрать фото'}
                    <input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={handleSelect} />
                </Button>

                {file && (
                    <>
                        {preview && !error && <Box component="img" src={preview} alt="Предпросмотр фото" sx={thumbSx} />}
                        <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>{file.name}</Typography>
                        <IconButton aria-label="Убрать выбранное фото" disabled={disabled} onClick={() => onChange(null)}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                )}

                {hasCurrent && !removeCurrent && (
                    <>
                        <Box component="img" src={currentUrl} alt="Текущее фото" sx={thumbSx} />
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>Текущее фото</Typography>
                        {onRemoveCurrentChange && (
                            <Button color="error" disabled={disabled} onClick={() => onRemoveCurrentChange(true)}>
                                Удалить фото
                            </Button>
                        )}
                    </>
                )}

                {hasCurrent && removeCurrent && (
                    <>
                        <Typography variant="body2" color="error" sx={{ flexGrow: 1 }}>
                            Фото будет удалено при сохранении
                        </Typography>
                        <Button disabled={disabled} onClick={() => onRemoveCurrentChange?.(false)}>Отменить</Button>
                    </>
                )}
            </Stack>
            <FormHelperText error={Boolean(error)}>
                {error ?? 'Необязательно. JPEG, PNG или WebP, до 5 МБ'}
            </FormHelperText>
        </Box>
    );
}
