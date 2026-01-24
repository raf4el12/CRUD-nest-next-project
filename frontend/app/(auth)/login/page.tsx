import { LoginForm } from '@/components/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Iniciar Sesión | CRUD App',
    description: 'Inicia sesión para acceder a tu cuenta',
};

export default function LoginPage() {
    return <LoginForm />;
}
