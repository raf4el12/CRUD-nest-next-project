'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authService } from '../services/auth.service';
import type { LoginDto, RegisterDto, User } from '../types';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginDto) => Promise<void>;
    register: (data: RegisterDto) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const token = Cookies.get('accessToken');
            if (!token) {
                setIsLoading(false);
                return;
            }
            const userData = await authService.getMe();
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (data: LoginDto) => {
        try {
            const { accessToken, refreshToken } = await authService.login(data);
            Cookies.set('accessToken', accessToken);
            Cookies.set('refreshToken', refreshToken);

            const userData = await authService.getMe();
            setUser(userData);

            toast.success('Sesión iniciada correctamente');

            if (userData.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error al iniciar sesión. Verifique sus credenciales.');
            throw err;
        }
    };

    const register = async (data: RegisterDto) => {
        try {
            await authService.register(data);
            toast.success('Cuenta creada exitosamente. Por favor inicia sesión.');
            router.push('/login');
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error(error);
            const message = error.response?.data?.message || 'Error al registrarse';
            toast.error(message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            setUser(null);
            router.push('/login');
            toast('Sesión cerrada');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
