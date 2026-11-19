import { Chip } from '@mui/material'
import { STATUS_LABEL } from '../model/types'
import type { PetStatus } from '../model/types'

const COLOR: Record<PetStatus, string> = {
    searching: '#cb982ac3',
    found: '#3b6e1dc3',
    closed: '#2152aec3',
};

export default function StatusChip({ status }: { status: PetStatus }) {
    return <Chip size="small" sx=
    {{backgroundColor: COLOR[status], color: 'white', transition: 'background-color 0.3s ease'}} 
        label={STATUS_LABEL[status]} />;
}