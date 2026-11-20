import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { FlyerTemplate } from '../../../entities/flyer-template';

interface Props {
    templates: FlyerTemplate[];
    value: number;
    onChange: (id: number) => void;
}

export default function FlyerTemplatePicker({ templates, value, onChange }: Props) {
    return (
        <ToggleButtonGroup
            exclusive
            size="small"
            orientation="vertical"
            value={value}
            onChange={(_, next: number | null) => next !== null && onChange(next)}
        >
            {templates.map((t) => (
                <ToggleButton key={t.id} value={t.id}>
                    {t.title}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
