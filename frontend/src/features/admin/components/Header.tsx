'use client';

import { useState } from 'react';
import Bell from 'lucide-react/dist/esm/icons/bell';
import Menu from 'lucide-react/dist/esm/icons/menu';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { Sidebar } from './Sidebar';
import { UserNav } from './UserNav';
import { Separator } from '@/shared/ui/separator';

export function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 lg:h-16 lg:px-6">
            {/* Mobile Menu Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                    <Sidebar onClose={() => setOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Breadcrumb / Title Area */}
            <div className="flex-1 md:flex-initial">
                <h1 className="text-lg font-semibold md:hidden">Admin</h1>
            </div>

            {/* Spacer */}
            <div className="flex-1 hidden md:block" />

            {/* Right Section */}
            <div className="flex items-center gap-2">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative" aria-label="Notificaciones">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                        3
                    </span>
                    <span className="sr-only">Notificaciones</span>
                </Button>

                <Separator orientation="vertical" className="h-6 hidden sm:block" />

                {/* User Navigation */}
                <UserNav />
            </div>
        </header>
    );
}
