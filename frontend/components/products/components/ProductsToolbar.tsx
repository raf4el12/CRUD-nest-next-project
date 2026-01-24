'use client';

import { Button } from "@/components/ui/button";
import { ProductAddDrawer } from "@/components/products/components/ProductAddDrawer";
import { useProductAddHook } from "@/components/products/hooks/useProductAddHook";

export function ProductsToolbar() {
  const { form, open, setOpen, onSubmit, isPending } = useProductAddHook();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold">Productos</h2>
        <p className="text-sm text-muted-foreground">
          Crea y administra tu catálogo desde aquí.
        </p>
      </div>

      <ProductAddDrawer
        open={open}
        onOpenChange={setOpen}
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        trigger={
          <Button size="sm">Agregar producto</Button>
        }
      />
    </div>
  );
}
