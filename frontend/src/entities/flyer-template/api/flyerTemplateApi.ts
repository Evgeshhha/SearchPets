import { apiFetch } from '../../../shared/api';
import type { FlyerTemplate } from '../model/types';

interface FlyerTemplateDto {
    id: number;
    code: string;
    title: string;
    header_color: string;
    background_color: string;
}

export async function fetchFlyerTemplates(): Promise<FlyerTemplate[]> {
    const items = await apiFetch<FlyerTemplateDto[]>('/api/flyer-templates');
    return items.map((t) => ({
        id: t.id,
        code: t.code,
        title: t.title,
        headerColor: t.header_color,
        backgroundColor: t.background_color,
    }));
}
