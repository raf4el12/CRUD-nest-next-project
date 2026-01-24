import { apiClient } from '@/lib/api-client';
import { LoginDto, LoginResponse, RegisterDto, User } from '@/types/auth';
import Cookies from 'js-cookie';

export const authService = {
    async login(data: LoginDto): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    async register(data: RegisterDto): Promise<LoginResponse> {
        // Usually register returns the user or tokens.
        // Let's assume it logs them in automatically or returns tokens similarly.
        // Checking AuthController: 
        // @Post('register') register(...) { return this.registerUseCase.execute(dto); }
        // RegisterUseCase returns just the user or tokens?
        // Let's assume standard flow. If it returns user, we might need a separate login.
        // BUT for now, let's implement the call. 
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    async logout() {
        // Optionally call backend to revoke token
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
