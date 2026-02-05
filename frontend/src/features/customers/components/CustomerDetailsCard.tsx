'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import type { Customer, CustomerStatus } from '../types';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import Edit from 'lucide-react/dist/esm/icons/edit';

const statusConfig: Record<CustomerStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Activo', variant: 'default' },
  inactive: { label: 'Inactivo', variant: 'secondary' },
  blocked: { label: 'Bloqueado', variant: 'destructive' },
};

interface CustomerDetailsCardProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  className?: string;
}

export function CustomerDetailsCard({ customer, onEdit, className }: CustomerDetailsCardProps) {
  const initials = customer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const statusConf = statusConfig[customer.status];

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="text-base">Información del Cliente</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => onEdit?.(customer)}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar & Basic Info */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={customer.avatar} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <h3 className="mt-4 text-lg font-semibold">{customer.name}</h3>
          <p className="text-sm text-muted-foreground">Cliente #{customer.id}</p>
          <Badge variant={statusConf.variant} className="mt-2">
            {statusConf.label}
          </Badge>
        </div>

        <Separator />

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Contacto</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${customer.email}`}
                className="text-primary hover:underline truncate"
              >
                {customer.email}
              </a>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
            )}
            {(customer.city || customer.country) && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {[customer.city, customer.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border bg-muted/50 p-3 text-center">
            <ShoppingBag className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
            <p className="text-2xl font-bold tabular-nums">{customer.ordersCount}</p>
            <p className="text-xs text-muted-foreground">Órdenes</p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-3 text-center">
            <DollarSign className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
            <p className="text-2xl font-bold tabular-nums">
              ${customer.totalSpent.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-muted-foreground">Total Gastado</p>
          </div>
        </div>

        {/* Member Since */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Cliente desde{' '}
            {new Date(customer.createdAt).toLocaleDateString('es-ES', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
