'use client';

import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Desktop Sidebar - Fixed */}
            <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
                <Sidebar />
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col md:pl-64">
                <Header />
                <main className="flex-1 p-4 sm:p-6 xl:px-8">
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
