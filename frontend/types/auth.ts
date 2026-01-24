export interface Profile {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    phone: string | null;
    photo: string | null;
}

export interface User {
    id: number;
    email: string;
    role: string;
    emailVerified: boolean;
    profile?: Profile | null;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}
