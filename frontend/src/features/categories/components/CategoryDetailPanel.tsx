import { Category } from "../types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/shared/ui/card";

interface CategoryDetailPanelProps {
  category: Category;
}

export function CategoryDetailPanel({ category }: CategoryDetailPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalle de la categoría</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Nombre</p>
          <p className="font-medium">{category.name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Creado</p>
          <p className="font-medium">{new Date(category.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Actualizado</p>
          <p className="font-medium">{new Date(category.updatedAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
