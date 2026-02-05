'use client';

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "../types";
import { Button } from "@/shared/ui/button";
import { ProductEditDrawer } from "./ProductEditDrawer";
import { useProductEditHook } from "../hooks/useProductEditHook";
import Pencil from "lucide-react/dist/esm/icons/pencil";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import { productsService } from "../services/products.service";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import ImageOff from "lucide-react/dist/esm/icons/image-off";

interface ProductsTableProps {
  products: Product[];
  readonly?: boolean;
  renderActions?: (product: Product) => React.ReactNode;
  onDelete?: (product: Product) => void;
}

function ProductRowActions({
  product,
  onDelete,
}: {
  product: Product;
  onDelete?: (product: Product) => void;
}) {
  const { form, open, setOpen, onSubmit, isPending } = useProductEditHook({ product });
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    try {
      if (onDelete) {
        onDelete(product);
        return;
      }

      await productsService.deleteProduct(product.id);
      toast.success("Producto eliminado");
      startTransition(() => router.refresh());
    } catch {
      toast.error("Error al eliminar el producto");
    }
  }, [onDelete, product, router, startTransition]);

  return (
    <div className="flex items-center gap-2">
      <ProductEditDrawer
        open={open}
        onOpenChange={setOpen}
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        productName={product.name}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="group h-8 w-8 border border-transparent transition-all duration-150 ease-out hover:border-border hover:bg-muted/60 hover:-translate-y-0.5"
            aria-label={`Editar ${product.name}`}
          >
            <Pencil className="h-4 w-4 transition-transform duration-150 ease-out group-hover:scale-110" />
          </Button>
        }
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="group h-8 w-8 border border-transparent text-destructive transition-all duration-150 ease-out hover:border-destructive/40 hover:bg-destructive/10 hover:-translate-y-0.5"
        aria-label={`Eliminar ${product.name}`}
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 className="h-4 w-4 transition-transform duration-150 ease-out group-hover:scale-110 group-hover:rotate-6" />
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar producto"
        description={`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}

export function ProductsTable({ 
  products, 
  readonly = false,
  renderActions,
  onDelete,
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
    <div className="overflow-x-auto rounded-lg border-2 border-border bg-card">
      <table className="w-full text-sm">
        <caption className="sr-only">Listado de productos</caption>
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Imagen</th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Nombre</th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Precio</th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Disponible</th>
            {showActions && (
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-border/60 transition-colors hover:bg-muted/30">
              <td className="px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/40">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <ImageOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-medium tracking-tight">{product.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">${product.price}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {product.isAvailable ? "Sí" : "No"}
              </td>
              {showActions && (
                <td className="px-4 py-3">
                  {renderActions ? renderActions(product) : (
                    <ProductRowActions product={product} onDelete={onDelete} />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
