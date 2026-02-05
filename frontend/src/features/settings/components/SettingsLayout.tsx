'use client';


import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import type { SettingsTab } from '../types';
import Store from 'lucide-react/dist/esm/icons/store';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import Truck from 'lucide-react/dist/esm/icons/truck';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Bell from 'lucide-react/dist/esm/icons/bell';
import type { LucideIcon } from 'lucide-react';

interface TabConfig {
  value: SettingsTab;
  label: string;
  icon: LucideIcon;
}

const tabs: TabConfig[] = [
  { value: 'store-details', label: 'Detalles de Tienda', icon: Store },
  { value: 'payments', label: 'Pagos', icon: CreditCard },
  { value: 'checkout', label: 'Checkout', icon: ShoppingCart },
  { value: 'shipping', label: 'Envíos', icon: Truck },
  { value: 'locations', label: 'Ubicaciones', icon: MapPin },
  { value: 'notifications', label: 'Notificaciones', icon: Bell },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  onSave?: () => void;
  onDiscard?: () => void;
  isSaving?: boolean;
  className?: string;
}

export function SettingsLayout({
  children,
  activeTab,
  onTabChange,
  onSave,
  onDiscard,
  isSaving = false,
  className,
}: SettingsLayoutProps) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-[250px_1fr]', className)}>
      {/* Sidebar Navigation */}
      <aside className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-4">Configuración</h2>
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => onTabChange(tab.value)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left',
                    activeTab === tab.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="space-y-6">
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="pr-4">{children}</div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={onDiscard} disabled={isSaving}>
            Descartar
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}
