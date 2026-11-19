import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FLYER_TEMPLATE_KEYS, FLYER_TEMPLATES } from '../model/templates';
import type { FlyerTemplateKey } from '../model/templates';

interface Props {
    value: FlyerTemplateKey;
    onChange: (next: FlyerTemplateKey) => void;
}

export default function FlyerTemplatePicker({ value, onChange }: Props) {
    return (
        <ToggleButtonGroup
            exclusive
            size="small"
            orientation="vertical"
            value={value}
            onChange={(_, next: FlyerTemplateKey | null) => next && onChange(next)}
        >
            {FLYER_TEMPLATE_KEYS.map((key) => (
                <ToggleButton key={key} value={key}>
                    {FLYER_TEMPLATES[key].label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
