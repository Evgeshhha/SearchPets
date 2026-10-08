import { Chip } from '@mui/material'
import { STATUS_LABEL } from '../types'
import type { PetStatus } from '../types'

const COLOR: Record<PetStatus, '#cb982ac3' | '#3b6e1dc3' | '#2152aec3'> = {
    searching: '#cb982ac3',
    found: '#3b6e1dc3',
    closed: '#2152aec3',
};

export default function StatusChip({ status }: { status: PetStatus }) {
    return <Chip size="small" sx={{backgroundColor: COLOR[status], color: 'white'}} label={STATUS_LABEL[status]} />;
}