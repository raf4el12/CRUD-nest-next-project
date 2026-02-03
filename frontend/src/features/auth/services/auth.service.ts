import { apiClient } from '@/shared/api';
import { LoginDto, LoginResponse, RegisterDto, User } from '../types';
import Cookies from 'js-cookie';

export const authService = {
    async login(data: LoginDto): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    async register(data: RegisterDto): Promise<LoginResponse> {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    async logout() {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
            try {
                await apiClient.post('/auth/logout', { refreshToken });
            } catch (error) {
                console.error('Logout error', error);
            }
        }
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
    },

    async getMe(): Promise<User> {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },
};
