'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useAuth } from '../context/auth-context';
import { Button } from '@/shared/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import { useState } from 'react';

const registerSchema = z.object({
    firstName: z.string().min(2, { message: 'Nombre requerido (min 2 letras)' }),
    lastName: z.string().min(2, { message: 'Apellido requerido (min 2 letras)' }),
    email: z.string().email({ message: 'Correo inválido' }),
    password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
    phone: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        try {
            await register(data);
        } catch {
            // Error is handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-lg mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Crear una cuenta</CardTitle>
                <CardDescription className="text-center">
                    Inicia tu viaje con nosotros hoy mismo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Juan" autoComplete="given-name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Apellido</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Pérez" autoComplete="family-name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="juan.perez@ejemplo.com" autoComplete="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+51 999 999 999" autoComplete="tel" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" autoComplete="new-password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 transition-colors mt-6"
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Inicia sesión
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
