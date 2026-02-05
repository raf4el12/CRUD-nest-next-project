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
import type { Customer, CustomerStatus } from '../types';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Edit from 'lucide-react/dist/esm/icons/edit';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Mail from 'lucide-react/dist/esm/icons/mail';

const columnHelper = createColumnHelper<Customer>();

const statusConfig: Record<CustomerStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Activo', variant: 'default' },
  inactive: { label: 'Inactivo', variant: 'secondary' },
  blocked: { label: 'Bloqueado', variant: 'destructive' },
};

interface CustomerDataTableProps {
  customers: Customer[];
  onViewDetails?: (customer: Customer) => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export function CustomerDataTable({ customers, onViewDetails, onEdit, onDelete }: CustomerDataTableProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<Customer, any>[]>(
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

      // Customer Name
      columnHelper.accessor('name', {
        header: 'Cliente',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={row.original.avatar} />
              <AvatarFallback>
                {row.original.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <Link 
                href={`/admin/customers/${row.original.id}`}
                className="font-medium hover:text-primary hover:underline block truncate"
              >
                {row.original.name}
              </Link>
              <p className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      }),

      // Customer ID
      {
        id: 'customerId',
        header: 'ID',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            #{row.original.id}
          </span>
        ),
        enableSorting: false,
      },

      // Country
      columnHelper.accessor('country', {
        header: 'País',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.countryCode && (
              <span className="text-base">
                {getCountryFlag(row.original.countryCode)}
              </span>
            )}
            <span className="text-sm">{row.original.country || '-'}</span>
          </div>
        ),
      }),

      // Orders Count
      columnHelper.accessor('ordersCount', {
        header: 'Órdenes',
        cell: ({ row }) => (
          <span className="text-sm tabular-nums">
            {row.original.ordersCount}
          </span>
        ),
      }),

      // Total Spent
      columnHelper.accessor('totalSpent', {
        header: 'Total Gastado',
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            ${row.original.totalSpent.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </span>
        ),
      }),

      // Status
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
              <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Enviar email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(row.original)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableGlobalFilter: false,
      },
    ],
    [onViewDetails, onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={customers}
      searchPlaceholder="Buscar clientes..."
      enableRowSelection
      emptyMessage="No se encontraron clientes"
    />
  );
}

// Helper function to get country flag emoji from country code
function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
