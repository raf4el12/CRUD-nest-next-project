'use client';

import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ProductEditDrawer } from "@/components/products/components/ProductEditDrawer";
import { useProductEditHook } from "@/components/products/hooks/useProductEditHook";

interface ProductsTableProps {
  products: Product[];
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

export function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No hay productos aún. Crea uno nuevo para empezar.
      </div>
    );
  }

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
            <th className="px-4 py-3 text-left font-medium">Acciones</th>
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
              <td className="px-4 py-3">
                <ProductRowActions product={product} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
