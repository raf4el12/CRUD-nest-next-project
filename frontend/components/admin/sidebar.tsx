'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import Package from 'lucide-react/dist/esm/icons/package';
import Settings from 'lucide-react/dist/esm/icons/settings';
import Tags from 'lucide-react/dist/esm/icons/tags';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Separator } from '@/components/ui/separator';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    onClose?: () => void;
}

const navItems = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin',
    },
    {
        label: 'Productos',
        icon: Package,
        href: '/admin/products',
    },
    {
        label: 'Categorías',
        icon: Tags,
        href: '/admin/categories',
    },
];

const configItems = [
    {
        label: 'Ajustes',
        icon: Settings,
        href: '/admin/settings',
    },
];

export function Sidebar({ className, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <div
            className={cn(
                'flex h-full flex-col bg-card border-r',
                className
            )}
        >
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b px-4 lg:h-16 lg:px-6">
                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                    <Package className="h-6 w-6 text-primary" />
                    <span className="text-lg">Admin Panel</span>
                </Link>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* User Info (Mobile) */}
            <div className="flex items-center gap-3 border-b p-4 md:hidden">
                <div className="h-10 w-10 rounded-full bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center text-primary font-semibold">
                    {user?.profile?.firstName?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                        {user?.profile?.firstName} {user?.profile?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                        Menú Principal
                    </p>
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                    'hover:bg-accent hover:text-accent-foreground',
                                    active
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground'
                                )}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <Separator className="my-4" />

                <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                        Configuración
                    </p>
                    {configItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                    'hover:bg-accent hover:text-accent-foreground',
                                    active
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground'
                                )}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div className="border-t p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => logout()}
                >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </Button>
            </div>
        </div>
    );
}
