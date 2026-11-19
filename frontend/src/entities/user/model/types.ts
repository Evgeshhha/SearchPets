export interface User {
    id: number;
    email: string;
    name: string;
    isAdmin: boolean;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}
