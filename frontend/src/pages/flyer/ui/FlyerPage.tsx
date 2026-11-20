import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Skeleton, Stack } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { DEFAULT_FLYER_TEMPLATE, fetchFlyerTemplates } from '../../../entities/flyer-template';
import { fetchPet } from '../../../entities/pet';
import { FlyerTemplatePicker } from '../../../features/choose-flyer-template';
import { useAsync } from '../../../shared/lib';
import { Appear, ErrorState } from '../../../shared/ui';
import { NotFoundPage } from '../../not-found';
import FlyerSheet from './FlyerSheet';

export default function FlyerPage() {
    const { id } = useParams();
    const { state, reload } = useAsync(async () => {
        const [pet, templates] = await Promise.all([fetchPet(id), fetchFlyerTemplates()]);
        return { pet, templates };
    }, [id]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    if (state.status === 'loading') {
        return (
            <Skeleton
                variant="rectangular"
                height={560}
                sx={{ maxWidth: 595, mx: 'auto', borderRadius: 2 }}
                aria-busy="true"
            />
        );
    }
    if (state.status === 'error') return <ErrorState message={state.message} onRetry={reload} />;

    const { pet } = state.data;
    if (!pet) return <NotFoundPage />;

    const templates = state.data.templates.length > 0 ? state.data.templates : [DEFAULT_FLYER_TEMPLATE];
    const template =
        templates.find((t) => t.id === selectedId) ??
        templates.find((t) => t.id === pet.flyerTemplateId) ??
        templates[0];

    return (
        <Appear>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ alignItems: { xs: 'stretch', md: 'flex-start' }, justifyContent: 'space-around', p: 3 }}
            >
                <Stack spacing={1} className="no-print" sx={{ minWidth: 180 }}>
                    <FlyerTemplatePicker templates={templates} value={template.id} onChange={setSelectedId} />
                    <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>
                        Печать
                    </Button>
                </Stack>
                <FlyerSheet pet={pet} template={template} />
            </Stack>
        </Appear>
    );
}
