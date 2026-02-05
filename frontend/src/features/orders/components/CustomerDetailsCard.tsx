'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import type { Order } from '../types';
import Mail from 'lucide-react/dist/esm/icons/mail';

import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

interface CustomerDetailsCardProps {
  order: Order;
  className?: string;
}

export function CustomerDetailsCard({ order, className }: CustomerDetailsCardProps) {
  const initials = order.customerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={order.customerAvatar} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">
              Cliente #{order.customerId}
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={`mailto:${order.customerEmail}`}
              className="text-primary hover:underline"
            >
              {order.customerEmail}
            </a>
          </div>
        </div>

        {/* View Profile Button */}
        <Button variant="outline" className="w-full" size="sm">
          <ExternalLink className="mr-2 h-4 w-4" />
          Ver perfil del cliente
        </Button>
      </CardContent>
    </Card>
  );
}
