'use client';

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { ProductAddDrawer } from "./ProductAddDrawer";
import { useProductAddHook } from "../hooks/useProductAddHook";
import { categoriesService } from "@/features/categories/services/categories.service";
import type { Category } from "@/features/categories/types";

export function ProductsToolbar() {
  const { form, open, setOpen, onSubmit, isPending } = useProductAddHook();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesService.getAllCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Productos</h2>
        <p className="text-sm text-foreground">
          Crea y administra tu catálogo desde aquí.
        </p>
      </div>

      <ProductAddDrawer
        open={open}
        onOpenChange={setOpen}
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        categories={categories}
        trigger={
          <Button size="sm" className="h-9 px-4 text-[11px] font-semibold uppercase tracking-[0.2em]">
            Agregar producto
          </Button>
        }
      />
    </div>
  );
}
