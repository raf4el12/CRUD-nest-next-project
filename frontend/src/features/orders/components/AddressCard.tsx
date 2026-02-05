'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import type { Order } from '../types';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';

interface AddressCardProps {
  order: Order;
  className?: string;
}

export function AddressCard({ order, className }: AddressCardProps) {
  const { shippingAddress, billingAddress } = order;

  const formatAddress = (address?: Order['shippingAddress']) => {
    if (!address) return 'No especificada';
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Direcciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shipping Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Dirección de Envío</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {formatAddress(shippingAddress)}
          </p>
        </div>

        {/* Billing Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Dirección de Facturación</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {formatAddress(billingAddress)}
          </p>
        </div>

        {/* Payment Method */}
        {order.paymentMethod && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground mb-1">Método de Pago</p>
            <p className="text-sm font-medium">{order.paymentMethod}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
