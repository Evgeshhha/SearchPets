export interface FlyerTemplate {
    id: number;
    code: string;
    title: string;
    headerColor: string;
    backgroundColor: string;
}

export const DEFAULT_FLYER_TEMPLATE: FlyerTemplate = {
    id: 0,
    code: 'default',
    title: 'Классический',
    headerColor: '#c62828',
    backgroundColor: '#ffffff',
};
