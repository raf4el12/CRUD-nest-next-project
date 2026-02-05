'use client';

import { Button } from "@/shared/ui/button";
import { CategoryAddDrawer } from "./CategoryAddDrawer";
import { useCategoryAddHook } from "../hooks/useCategoryAddHook";

export function CategoriesToolbar() {
  const { form, open, setOpen, onSubmit, isPending } = useCategoryAddHook();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Categorías</h2>
        <p className="text-sm text-foreground">
          Crea y administra las categorías desde aquí.
        </p>
      </div>

      <CategoryAddDrawer
        open={open}
        onOpenChange={setOpen}
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        trigger={
          <Button size="sm" className="h-9 px-4 text-[11px] font-semibold uppercase tracking-[0.2em]">
            Agregar categoría
          </Button>
        }
      />
    </div>
  );
}
