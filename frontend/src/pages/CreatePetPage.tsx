import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Grid, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { KIND_LABEL } from '../types'

export default function CreatePetPage() {
    const navigate = useNavigate();
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => navigate('/'), 1200);
    };

    const [photo, setPhoto] = useState<File | null>(null);

    const handlePhotoChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setPhoto(file);
        }
    };

    return (
        <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: 720, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>Новое объявление</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }} ><TextField required fullWidth label="Кличка" /></Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField select required fullWidth label="Вид" defaultValue="dog">
                            {Object.entries(KIND_LABEL).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Порода" /></Grid>
                    <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Окрас" /></Grid>
                    <Grid size={{ xs: 12, md: 12 }}><TextField fullWidth multiline minRows={3} label="Приметы и описание" /></Grid>
                    <Grid size={{ xs: 12, md: 6 }}><TextField required fullWidth label="Место, где видели в последний раз" /></Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField required fullWidth type="date" label="Дата"
                            slotProps={{
                                inputLabel: { shrink: true, },
                            }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}><TextField required fullWidth label="Имя контактного лица" /></Grid>
                    <Grid size={{ xs: 12, md: 6 }}><TextField required fullWidth label="Телефон" /></Grid>

                    <Grid container spacing={2} size={{ xs: 12}}>
                            <Grid size={{ xs: 12, md:7 }}>
                                <TextField fullWidth label="Фотография питомца" value={photo?.name ?? ''}
                                    slotProps={{ input: { readOnly: true, }, }} />
                            </Grid>
                            <Grid size={{ xs: 12, md:5 }}>
                                <Button component="label" variant="outlined" fullWidth sx={{ height: '56px' }}>
                                    Выбрать фото
                                    <input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange}/>
                                </Button>
                            </Grid>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Button type="submit" variant="contained" size="large" fullWidth>Опубликовать</Button>
                    </Grid>
                    {sent && <Grid size={{ xs: 12 }}><Alert severity="success">Объявление сохранено (демо)</Alert></Grid>}
                </Grid>
            </form>
        </Paper>
    );
}