import { Button, IconButton, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { hasActiveFilters, KIND_LABEL, PET_KINDS, PET_STATUSES, STATUS_LABEL } from '../../../entities/pet';
import type { PetFilters as Filters, PetKind, PetStatus } from '../../../entities/pet';

interface Props {
    filters: Filters;
    onChange: (next: Filters) => void;
    onReset: () => void;
}

export default function PetFilters({ filters, onChange, onReset }: Props) {
    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3, alignItems: { md: 'center' } }}>
            <TextField
                label="Поиск по кличке, породе, месту"
                value={filters.query}
                onChange={(e) => onChange({ ...filters, query: e.target.value })}
                sx={{ minWidth: { md: 320 } }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: filters.query && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    aria-label="Очистить поиск"
                                    onClick={() => onChange({ ...filters, query: '' })}
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <TextField
                select
                label="Статус"
                value={filters.status}
                onChange={(e) => onChange({ ...filters, status: e.target.value as PetStatus | '' })}
                sx={{ minWidth: 180 }}
            >
                <MenuItem value="">Все</MenuItem>
                {PET_STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>{STATUS_LABEL[s]}</MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Вид"
                value={filters.kind}
                onChange={(e) => onChange({ ...filters, kind: e.target.value as PetKind | '' })}
                sx={{ minWidth: 180 }}
            >
                <MenuItem value="">Все</MenuItem>
                {PET_KINDS.map((k) => (
                    <MenuItem key={k} value={k}>{KIND_LABEL[k]}</MenuItem>
                ))}
            </TextField>
            {hasActiveFilters(filters) && (
                <Button onClick={onReset} startIcon={<ClearIcon />}>
                    Сбросить
                </Button>
            )}
        </Stack>
    );
}
