import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PetsIcon from '@mui/icons-material/Pets';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { hasActiveFilters, PetCard, PetCardSkeleton, usePetList } from '../../../entities/pet';
import { PetFilters, usePetFilters } from '../../../features/filter-pets';
import { Appear, ErrorState, StateMessage } from '../../../shared/ui';

const SKELETON_COUNT = 6;
const STAGGER_STEPS = 6;
const STAGGER_MS = 60;

export default function HomePage() {
    const { filters, applied, setFilters, reset } = usePetFilters();
    const { state, reload, loadMore } = usePetList(applied);

    const renderContent = () => {
        if (state.status === 'loading') {
            return (
                <Grid container spacing={2} aria-busy="true" aria-label="Загрузка объявлений">
                    {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                            <PetCardSkeleton />
                        </Grid>
                    ))}
                </Grid>
            );
        }

        if (state.status === 'error') {
            return <ErrorState message={state.message ?? 'Не удалось загрузить объявления'} onRetry={reload} />;
        }

        if (state.items.length === 0) {
            if (hasActiveFilters(applied)) {
                return (
                    <StateMessage
                        icon={<SearchOffIcon sx={{ fontSize: 56, color: 'text.disabled' }} />}
                        title="Ничего не найдено"
                        description="Попробуйте изменить или сбросить фильтры."
                        action={<Button onClick={reset}>Сбросить фильтры</Button>}
                    />
                );
            }
            return (
                <StateMessage
                    icon={<PetsIcon sx={{ fontSize: 56, color: 'text.disabled' }} />}
                    title="Пока нет ни одного объявления"
                    description="Если ваш питомец пропал — опубликуйте объявление, это займёт пару минут."
                    action={
                        <Button variant="contained" component={RouterLink} to="/pets/new" startIcon={<AddIcon />}>
                            Подать объявление
                        </Button>
                    }
                />
            );
        }

        return (
            <>
                <Typography color="text.secondary" sx={{ mb: 2 }} aria-live="polite">
                    Показано объявлений: {state.items.length}
                </Typography>
                <Grid container spacing={2}>
                    {state.items.map((pet, index) => (
                        <Grid key={pet.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Appear fullHeight delay={(index % STAGGER_STEPS) * STAGGER_MS}>
                                <PetCard pet={pet} />
                            </Appear>
                        </Grid>
                    ))}
                </Grid>
                {state.moreError && (
                    <Alert severity="error" sx={{ mt: 2 }}>{state.moreError}</Alert>
                )}
                {state.hasMore && (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={loadMore}
                            disabled={state.loadingMore}
                            startIcon={state.loadingMore ? <CircularProgress size={18} /> : undefined}
                        >
                            {state.loadingMore ? 'Загружаем…' : 'Показать ещё'}
                        </Button>
                    </Box>
                )}
            </>
        );
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Объявления о пропавших животных
            </Typography>
            <PetFilters filters={filters} onChange={setFilters} onReset={reset} />
            {renderContent()}
        </>
    );
}