'use client';

import { Category } from "../types";
import { Button } from "@/shared/ui/button";
import { CategoryEditDrawer } from "./CategoryEditDrawer";
import { useCategoryEditHook } from "../hooks/useCategoryEditHook";

interface CategoriesTableProps {
  categories: Category[];
  readonly?: boolean;
  renderActions?: (category: Category) => React.ReactNode;
}

function CategoryRowActions({ category }: { category: Category }) {
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

export function CategoriesTable({ 
  categories, 
  readonly = false,
  renderActions 
}: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No hay categorías aún. Crea una nueva para comenzar.
      </div>
    );
  }

  const showActions = !readonly;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <caption className="sr-only">Listado de categorías</caption>
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left font-medium">ID</th>
            <th className="px-4 py-3 text-left font-medium">Nombre</th>
            <th className="px-4 py-3 text-left font-medium">Actualizado</th>
            {showActions && (
              <th className="px-4 py-3 text-left font-medium">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t transition-colors hover:bg-muted/30">
              <td className="px-4 py-3 text-muted-foreground">#{category.id}</td>
              <td className="px-4 py-3 font-medium">{category.name}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(category.updatedAt).toLocaleDateString()}
              </td>
              {showActions && (
                <td className="px-4 py-3">
                  {renderActions ? renderActions(category) : <CategoryRowActions category={category} />}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
