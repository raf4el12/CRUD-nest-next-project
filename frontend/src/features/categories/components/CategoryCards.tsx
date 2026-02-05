'use client';

import type { Category } from "../types";
import { Button } from "@/shared/ui/button";
import { CategoryEditDrawer } from "./CategoryEditDrawer";
import { useCategoryEditHook } from "../hooks/useCategoryEditHook";

interface CategoryCardsProps {
  categories: Category[];
  readonly?: boolean;
}

function CategoryCardActions({ category }: { category: Category }) {
  const { form, open, setOpen, onSubmit, isPending } = useCategoryEditHook({ category });

  return (
    <CategoryEditDrawer
      open={open}
      onOpenChange={setOpen}
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isPending}
      categoryName={category.name}
      trigger={
        <Button variant="outline" size="sm">
          Editar
        </Button>
      }
    />
  );
}

export function CategoryCards({ categories, readonly = false }: CategoryCardsProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No hay categorías aún. Crea una nueva para comenzar.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">ID #{category.id}</p>
              <h3 className="text-base font-semibold transition-colors group-hover:text-primary">
                {category.name}
              </h3>
            </div>
            {!readonly && <CategoryCardActions category={category} />}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            <p>Creado: {new Date(category.createdAt).toLocaleDateString()}</p>
            <p>Actualizado: {new Date(category.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
