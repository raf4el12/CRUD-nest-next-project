'use client';

import { useMemo, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/shared/ui/data-table/DataTable';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Switch } from '@/shared/ui/switch';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import type { Product } from '../types';
import { productsService } from '../services/products.service';
import toast from 'react-hot-toast';
import MoreVertical from 'lucide-react/dist/esm/icons/more-vertical';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Copy from 'lucide-react/dist/esm/icons/copy';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Package from 'lucide-react/dist/esm/icons/package';

const columnHelper = createColumnHelper<Product>();

interface ProductDataTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
}

export function ProductDataTable({ products, onEdit }: ProductDataTableProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleDelete = useCallback(async (product: Product) => {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    
    try {
      await productsService.deleteProduct(product.id);
      toast.success('Producto eliminado');
      startTransition(() => router.refresh());
    } catch {
      toast.error('Error al eliminar el producto');
    }
  }, [router]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<Product, any>[]>(
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

      // Product Column (Image + Name)
      columnHelper.accessor('name', {
        header: 'Producto',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
              {row.original.image ? (
                <img
                  src={row.original.image}
                  alt={row.original.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">{row.original.name}</p>
              {row.original.description && (
                <p className="text-xs text-muted-foreground truncate max-w-50">
                  {row.original.description}
                </p>
              )}
            </div>
          </div>
        ),
      }),

      // Category Column
      columnHelper.accessor('categoryId', {
        header: 'Categoría',
        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.original.categoryId ? `Cat #${row.original.categoryId}` : 'Sin categoría'}
          </Badge>
        ),
      }),

      // Price Column
      columnHelper.accessor('price', {
        header: 'Precio',
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            ${row.original.price.toFixed(2)}
          </span>
        ),
      }),

      // Stock Column
      columnHelper.accessor('isAvailable', {
        header: 'Stock',
        cell: ({ row }) => (
          <Switch
            checked={row.original.isAvailable}
            onCheckedChange={async (checked) => {
              try {
                await productsService.updateProduct(row.original.id, {
                  name: row.original.name,
                  price: row.original.price,
                  isAvailable: checked,
                  description: row.original.description ?? undefined,
                  categoryId: row.original.categoryId ?? undefined,
                  image: row.original.image ?? undefined,
                });
                toast.success(checked ? 'Producto en stock' : 'Producto sin stock');
                startTransition(() => router.refresh());
              } catch {
                toast.error('Error al actualizar');
              }
            }}
            aria-label={row.original.isAvailable ? 'En stock' : 'Sin stock'}
          />
        ),
        enableSorting: false,
      }),

      // Status Badge
      {
        id: 'status',
        header: 'Estado',
        cell: ({ row }) => (
          <Badge variant={row.original.isAvailable ? 'default' : 'destructive'}>
            {row.original.isAvailable ? 'Activo' : 'Inactivo'}
          </Badge>
        ),
        enableSorting: false,
      },

      // Actions Column
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
              <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(row.original)}
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
    [onEdit, router, handleDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={products}
      searchPlaceholder="Buscar productos..."
      enableRowSelection
      emptyMessage="No se encontraron productos"
    />
  );
}
