'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { createColumnHelper } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/shared/ui/data-table/DataTable';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Checkbox } from '@/shared/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import type { Order, OrderStatus, PaymentStatus } from '../types';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Truck from 'lucide-react/dist/esm/icons/truck';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import FileText from 'lucide-react/dist/esm/icons/file-text';

const columnHelper = createColumnHelper<Order>();

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  processing: { label: 'Procesando', variant: 'outline' },
  shipped: { label: 'Enviado', variant: 'default' },
  delivered: { label: 'Entregado', variant: 'default' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

const paymentConfig: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-600' },
  paid: { label: 'Pagado', color: 'text-green-600' },
  failed: { label: 'Fallido', color: 'text-red-600' },
  refunded: { label: 'Reembolsado', color: 'text-blue-600' },
};

interface OrderDataTableProps {
  orders: Order[];
  onViewDetails?: (order: Order) => void;
}

export function OrderDataTable({ orders, onViewDetails }: OrderDataTableProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<Order, any>[]>(
    () => [
      // Selection Column
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Seleccionar todo"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Seleccionar fila"
          />
        ),
        enableSorting: false,
        enableGlobalFilter: false,
      },

      // Order Number
      columnHelper.accessor('orderNumber', {
        header: 'Orden',
        cell: ({ row }) => (
          <Link 
            href={`/admin/orders/${row.original.id}`}
            className="font-medium text-primary hover:underline"
          >
            #{row.original.orderNumber}
          </Link>
        ),
      }),

      // Customer
      columnHelper.accessor('customerName', {
        header: 'Cliente',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.customerAvatar} />
              <AvatarFallback>
                {row.original.customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{row.original.customerName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {row.original.customerEmail}
              </p>
            </div>
          </div>
        ),
      }),

      // Date
      columnHelper.accessor('createdAt', {
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        ),
      }),

      // Items Count
      {
        id: 'items',
        header: 'Items',
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.items.length} {row.original.items.length === 1 ? 'producto' : 'productos'}
          </span>
        ),
        enableSorting: false,
      },

      // Total
      columnHelper.accessor('total', {
        header: 'Total',
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            ${row.original.total.toFixed(2)}
          </span>
        ),
      }),

      // Payment Status
      columnHelper.accessor('paymentStatus', {
        header: 'Pago',
        cell: ({ row }) => {
          const config = paymentConfig[row.original.paymentStatus];
          return (
            <span className={`text-sm font-medium ${config.color}`}>
              {config.label}
            </span>
          );
        },
      }),

      // Order Status
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: ({ row }) => {
          const config = statusConfig[row.original.status];
          return (
            <Badge variant={config.variant}>
              {config.label}
            </Badge>
          );
        },
      }),

      // Actions
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Truck className="mr-2 h-4 w-4" />
                Actualizar envío
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Generar factura
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Cancelar orden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableGlobalFilter: false,
      },
    ],
    [onViewDetails]
  );

  return (
    <DataTable
      columns={columns}
      data={orders}
      searchPlaceholder="Buscar órdenes..."
      enableRowSelection
      emptyMessage="No se encontraron órdenes"
    />
  );
}
