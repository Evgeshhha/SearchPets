import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deletePet } from '../../../entities/pet';
import type { PetAd } from '../../../entities/pet';

interface Props {
    pet: PetAd;
    onDeleted: () => void;
}

export default function DeletePetButton({ pet, onDeleted }: Props) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setPending(true);
        setError(null);
        try {
            await deletePet(pet.id);
            setOpen(false);
            onDeleted();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Не удалось удалить объявление');
        } finally {
            setPending(false);
        }
    };

    return (
        <>
            <Button color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => setOpen(true)}>
                Удалить
            </Button>
            <Dialog open={open} onClose={() => !pending && setOpen(false)}>
                <DialogTitle>Удалить объявление?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Объявление о питомце «{pet.name}» будет удалено без возможности восстановления.
                    </DialogContentText>
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={pending}>Отмена</Button>
                    <Button color="error" onClick={handleDelete} disabled={pending}>Удалить</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
