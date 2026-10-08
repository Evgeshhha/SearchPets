import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import { getPetById } from '../data/mock'
import { KIND_LABEL } from '../types'
import NotFoundPage from './NotFoundPage'

const TEMPLATES = {
    classic: { label: 'Классический', bg: '#ffffff', headBg: '#c62828', headColor: '#fff' },
    bright: { label: 'Яркий', bg: '#fff8e1', headBg: '#ff6f00', headColor: '#fff' },
    mono: { label: 'Чёрно-белый', bg: '#ffffff', headBg: '#000000', headColor: '#fff' },
} as const;
type TemplateKey = keyof typeof TEMPLATES;

export default function FlyerPage() {
    const { id } = useParams();
    const pet = getPetById(id);
    const [tpl, setTpl] = useState<TemplateKey>('classic');
    if (!pet) return <NotFoundPage />;
    const t = TEMPLATES[tpl];

    return (
        <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}
                sx={{
                    alignItems: { xs: 'stretch', md: 'flex-start' },
                    justifyContent: 'space-around',
                    p: 3,
                }}>
                <Stack direction="column" spacing={1} className="no-print" sx={{ minWidth: 180, }}>
                    <ToggleButtonGroup exclusive value={tpl} onChange={(_, v) => v && setTpl(v)} size="small" orientation="vertical">
                        {Object.entries(TEMPLATES).map(([k, v]) => (
                            <ToggleButton key={k} value={k}>
                                {v.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                    <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>
                        Печать
                    </Button>
                </Stack>

                <Paper sx={{ maxWidth: 595, width: '100%', bgcolor: t.bg, overflow: 'hidden', }}>
                    <Box sx={{ bgcolor: t.headBg, color: t.headColor, p: 2, textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 800 }} >ПРОПАЛ ПИТОМЕЦ</Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        {pet.photoUrl && (
                            <Box component="img" src={pet.photoUrl} alt={pet.name} sx={{ width: '100%', maxHeight: 320, objectFit: 'cover', mb: 2 }} />
                        )}
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>{pet.name}</Typography>
                        <Typography variant="h6">{KIND_LABEL[pet.kind]}, {pet.breed}, {pet.color}</Typography>
                        <Typography sx={{ mt: 1 }}>{pet.description}</Typography>
                        <Typography sx={{ mt: 1 }}><b>Пропал:</b> {pet.lastSeenPlace}, {new Date(pet.lastSeenDate).toLocaleDateString('ru-RU')}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mt: 3, textAlign: "center" }}>
                            {pet.contactName}: {pet.contactPhone}
                        </Typography>
                    </Box>
                </Paper>
            </Stack>
        </>
    );
}