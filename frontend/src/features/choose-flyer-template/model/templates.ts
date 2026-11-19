export const FLYER_TEMPLATES = {
    classic: { label: 'Классический', bg: '#ffffff', headBg: '#c62828', headColor: '#fff' },
    bright: { label: 'Яркий', bg: '#fff8e1', headBg: '#ff6f00', headColor: '#fff' },
    mono: { label: 'Чёрно-белый', bg: '#ffffff', headBg: '#000000', headColor: '#fff' },
} as const;

export type FlyerTemplateKey = keyof typeof FLYER_TEMPLATES;
export type FlyerTemplate = (typeof FLYER_TEMPLATES)[FlyerTemplateKey];

export const FLYER_TEMPLATE_KEYS = Object.keys(FLYER_TEMPLATES) as FlyerTemplateKey[];
