'use client';

import { Product } from "../types";
import { Button } from "@/shared/ui/button";
import { ProductEditDrawer } from "./ProductEditDrawer";
import { useProductEditHook } from "../hooks/useProductEditHook";

interface ProductsTableProps {
  products: Product[];
  readonly?: boolean;
  renderActions?: (product: Product) => React.ReactNode;
}

function ProductRowActions({ product }: { product: Product }) {
  const { form, open, setOpen, onSubmit, isPending } = useProductEditHook({ product });

  return (
    <ProductEditDrawer
      open={open}
      onOpenChange={setOpen}
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isPending}
      productName={product.name}
      trigger={
        <Button variant="outline" size="sm">
          Editar
        </Button>
      }
    />
  );
}

export function ProductsTable({ 
  products, 
  readonly = false,
  renderActions 
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No hay productos aún. Crea uno nuevo para empezar.
      </div>
    );
  }

  const showActions = !readonly;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <caption className="sr-only">Listado de productos</caption>
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left font-medium">ID</th>
            <th className="px-4 py-3 text-left font-medium">Nombre</th>
            <th className="px-4 py-3 text-left font-medium">Precio</th>
            <th className="px-4 py-3 text-left font-medium">Disponible</th>
            {showActions && (
              <th className="px-4 py-3 text-left font-medium">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t transition-colors hover:bg-muted/30">
              <td className="px-4 py-3 text-muted-foreground">#{product.id}</td>
              <td className="px-4 py-3 font-medium">{product.name}</td>
              <td className="px-4 py-3 text-muted-foreground">${product.price}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {product.isAvailable ? "Sí" : "No"}
              </td>
              {showActions && (
                <td className="px-4 py-3">
                  {renderActions ? renderActions(product) : <ProductRowActions product={product} />}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
