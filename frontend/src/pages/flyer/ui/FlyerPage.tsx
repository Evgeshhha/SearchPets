import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Skeleton, Stack } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { fetchPet } from '../../../entities/pet';
import { FLYER_TEMPLATES, FlyerTemplatePicker } from '../../../features/choose-flyer-template';
import type { FlyerTemplateKey } from '../../../features/choose-flyer-template';
import { useAsync } from '../../../shared/lib';
import { Appear, ErrorState } from '../../../shared/ui';
import { NotFoundPage } from '../../not-found';
import FlyerSheet from './FlyerSheet';

export default function FlyerPage() {
    const { id } = useParams();
    const { state, reload } = useAsync(() => fetchPet(id), [id]);
    const [templateKey, setTemplateKey] = useState<FlyerTemplateKey>('classic');

    if (state.status === 'loading') {
        return <Skeleton variant="rectangular" height={560} sx={{ maxWidth: 595, mx: 'auto', borderRadius: 2 }} aria-busy="true" />;
    }
    if (state.status === 'error') return <ErrorState message={state.message} onRetry={reload} />;
    if (!state.data) return <NotFoundPage />;

    return (
        <Appear>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ alignItems: { xs: 'stretch', md: 'flex-start' }, justifyContent: 'space-around', p: 3 }}
            >
                <Stack spacing={1} className="no-print" sx={{ minWidth: 180 }}>
                    <FlyerTemplatePicker value={templateKey} onChange={setTemplateKey} />
                    <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>
                        Печать
                    </Button>
                </Stack>
                <FlyerSheet pet={state.data} template={FLYER_TEMPLATES[templateKey]} />
            </Stack>
        </Appear>
    );
}
