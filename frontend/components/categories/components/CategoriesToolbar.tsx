'use client';

import { Button } from "@/components/ui/button";
import { CategoryAddDrawer } from "@/components/categories/components/CategoryAddDrawer";
import { useCategoryAddHook } from "@/components/categories/hooks/useCategoryAddHook";

export function CategoriesToolbar() {
  const { form, open, setOpen, onSubmit, isPending } = useCategoryAddHook();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold">Categorías</h2>
        <p className="text-sm text-muted-foreground">
          Crea y administra las categorías desde aquí.
        </p>
      </div>

      <CategoryAddDrawer
        open={open}
        onOpenChange={setOpen}
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        trigger={<Button size="sm">Agregar categoría</Button>}
      />
    </div>
  );
}
