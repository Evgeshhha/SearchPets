import { IconButton, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDateTime } from '../../../shared/lib';
import type { Sighting } from '../model/types';

interface Props {
    sightings: Sighting[];
    onDelete?: (sighting: Sighting) => void;
    busyId?: number | null;
}

export default function SightingList({ sightings, onDelete, busyId }: Props) {
    return (
        <List disablePadding>
            {sightings.map((s) => (
                <ListItem
                    key={s.id}
                    divider
                    disableGutters
                    secondaryAction={
                        onDelete && (
                            <Tooltip title="Удалить отметку">
                                <span>
                                    <IconButton
                                        edge="end"
                                        aria-label="Удалить отметку"
                                        disabled={busyId === s.id}
                                        onClick={() => onDelete(s)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )
                    }
                >
                    <ListItemText
                        primary={`${s.place} — ${formatDateTime(s.seenAt)}`}
                        secondary={
                            <>
                                {s.comment && (
                                    <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                        {s.comment}
                                    </Typography>
                                )}
                                {s.contact && (
                                    <Typography component="span" variant="body2" color="text.secondary">
                                        Контакт: {s.contact}
                                    </Typography>
                                )}
                            </>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
}
