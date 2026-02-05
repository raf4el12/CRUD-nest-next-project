'use client';

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "../types";
import { Button } from "@/shared/ui/button";
import { CategoryEditDrawer } from "./CategoryEditDrawer";
import { useCategoryEditHook } from "../hooks/useCategoryEditHook";
import Pencil from "lucide-react/dist/esm/icons/pencil";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import { categoriesService } from "../services/categories.service";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";

interface CategoriesTableProps {
  categories: Category[];
  readonly?: boolean;
  renderActions?: (category: Category) => React.ReactNode;
  onDelete?: (category: Category) => void;
}

function CategoryRowActions({
  category,
  onDelete,
}: {
  category: Category;
  onDelete?: (category: Category) => void;
}) {
  const { form, open, setOpen, onSubmit, isPending } = useCategoryEditHook({ category });
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    try {
      if (onDelete) {
        onDelete(category);
        return;
      }

      await categoriesService.deleteCategory(category.id);
      toast.success("Categoría eliminada");
      startTransition(() => router.refresh());
    } catch {
      toast.error("Error al eliminar la categoría");
    }
  }, [category, onDelete, router, startTransition]);

  return (
    <div className="flex items-center gap-2">
      <CategoryEditDrawer
        open={open}
        onOpenChange={setOpen}
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        categoryName={category.name}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="group h-8 w-8 border border-transparent transition-all duration-150 ease-out hover:border-border hover:bg-muted/60 hover:-translate-y-0.5"
            aria-label={`Editar ${category.name}`}
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
        aria-label={`Eliminar ${category.name}`}
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 className="h-4 w-4 transition-transform duration-150 ease-out group-hover:scale-110 group-hover:rotate-6" />
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar categoría"
        description={`¿Eliminar "${category.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}

export function CategoriesTable({ 
  categories, 
  readonly = false,
  renderActions,
  onDelete,
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
    <div className="overflow-x-auto rounded-lg border-2 border-border bg-card">
      <table className="w-full text-sm">
        <caption className="sr-only">Listado de categorías</caption>
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">ID</th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Nombre</th>
            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Actualizado</th>
            {showActions && (
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t border-border/60 transition-colors hover:bg-muted/30">
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{category.id}</td>
              <td className="px-4 py-3 font-medium tracking-tight">{category.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {new Date(category.updatedAt).toLocaleDateString()}
              </td>
              {showActions && (
                <td className="px-4 py-3">
                  {renderActions ? renderActions(category) : (
                    <CategoryRowActions category={category} onDelete={onDelete} />
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
