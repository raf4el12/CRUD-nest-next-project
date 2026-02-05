'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';
import type { Order } from '../types';
import Package from 'lucide-react/dist/esm/icons/package';

interface OrderDetailsCardProps {
  order: Order;
  className?: string;
}

export function OrderDetailsCard({ order, className }: OrderDetailsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Detalles del Pedido</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Orden #{order.orderNumber}
          </p>
        </div>
        <Badge variant="outline">{order.items.length} items</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-3"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  ${item.unitPrice.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <p className="font-medium text-sm tabular-nums">
                ${item.totalPrice.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span className="tabular-nums">${order.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Impuestos</span>
            <span className="tabular-nums">${order.tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="tabular-nums">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
