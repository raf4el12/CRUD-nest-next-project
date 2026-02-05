import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Registrarse | CRUD App',
    description: 'Crea una nueva cuenta',
};

export default function RegisterPage() {
    return <RegisterForm />;
}
