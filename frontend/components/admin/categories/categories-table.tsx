import { Category } from "@/lib/types";

interface CategoriesTableProps {
  categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No hay categorías aún. Crea una nueva para comenzar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <caption className="sr-only">Listado de categorías</caption>
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left font-medium">ID</th>
            <th className="px-4 py-3 text-left font-medium">Nombre</th>
            <th className="px-4 py-3 text-left font-medium">Creado</th>
            <th className="px-4 py-3 text-left font-medium">Actualizado</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t transition-colors hover:bg-muted/30">
              <td className="px-4 py-3 text-muted-foreground">#{category.id}</td>
              <td className="px-4 py-3 font-medium">{category.name}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(category.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(category.updatedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
