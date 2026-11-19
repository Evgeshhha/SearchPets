import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PetsIcon from '@mui/icons-material/Pets';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { fetchPets, filterPets, hasActiveFilters, PetCard, PetCardSkeleton} from '../../../entities/pet';
import { PetFilters, usePetFilters} from '../../../features/filter-pets';
import { useAsync } from '../../../shared/lib';
import { Appear, ErrorState, StateMessage } from '../../../shared/ui';

const SKELETON_COUNT = 6;
const MAX_STAGGER_MS = 300;

export default function HomePage() {
    const { filters, setFilters, reset } = usePetFilters();
    const { state, reload } = useAsync(fetchPets, []);

    const renderContent = () => {
        if (state.status === 'loading') {
            return (
                <Grid
                    container
                    spacing={2}
                    aria-busy="true"
                    aria-label="Загрузка объявлений">
                    {Array.from(
                        { length: SKELETON_COUNT },
                        (_, i) => (
                            <Grid
                                key={i}
                                size={{ xs: 12, sm: 6, md: 4 }}>
                                <PetCardSkeleton />
                            </Grid>
                        )
                    )}
                </Grid>
            );
        }

        if (state.status === 'error') {
            return (
                <ErrorState
                    message={state.message}
                    onRetry={reload}
                />
            );
        }

        if (state.data.length === 0) {
            return (
                <StateMessage
                    icon={
                        <PetsIcon
                            sx={{
                                fontSize: 56,
                                color: 'text.disabled'
                            }}
                        />
                    }
                    title="Пока нет ни одного объявления"
                    description="Если ваш питомец пропал — опубликуйте объявление, это займёт пару минут."
                    action={
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to="/pets/new"
                            startIcon={<AddIcon />}
                        >
                            Подать объявление
                        </Button>
                    }
                />
            );
        }

        const pets = filterPets(state.data, filters);

        if (pets.length === 0) {
            return (
                <StateMessage
                    icon={
                        <SearchOffIcon
                            sx={{
                                fontSize: 56,
                                color: 'text.disabled'
                            }}
                        />
                    }
                    title="Ничего не найдено"
                    description={
                        hasActiveFilters(filters)
                            ? 'Попробуйте изменить или сбросить фильтры.'
                            : undefined
                    }
                    action={
                        hasActiveFilters(filters)
                            ? (
                                <Button onClick={reset}>
                                    Сбросить фильтры
                                </Button>
                            )
                            : undefined
                    }
                />
            );
        }

        return (
            <>
                <Typography
                    color="text.secondary"
                    sx={{ mb: 2 }}
                    aria-live="polite"
                >
                    Найдено объявлений: {pets.length}
                </Typography>

                <Grid container spacing={2}>
                    {pets.map((pet, index) => (
                        <Grid
                            key={pet.id}
                            size={{ xs: 12, sm: 6, md: 4 }}
                        >
                            <Appear
                                fullHeight
                                delay={Math.min(
                                    index * 60,
                                    MAX_STAGGER_MS
                                )}
                            >
                                <PetCard pet={pet} />
                            </Appear>
                        </Grid>
                    ))}
                </Grid>
            </>
        );
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Объявления о пропавших животных
            </Typography>

            <PetFilters
                filters={filters}
                onChange={setFilters}
                onReset={reset}
            />

            {renderContent()}
        </>
    );
}
