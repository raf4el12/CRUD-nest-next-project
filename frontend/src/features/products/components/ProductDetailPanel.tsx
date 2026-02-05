import type { Product } from "../types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/shared/ui/card";

interface ProductDetailPanelProps {
  product: Product;
}

export function ProductDetailPanel({ product }: ProductDetailPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalle del producto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Nombre</p>
          <p className="font-medium">{product.name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Precio</p>
          <p className="font-medium">${product.price}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Categoría</p>
          <p className="font-medium">{product.categoryId ?? "Sin categoría"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Disponibilidad</p>
          <p className="font-medium">{product.isAvailable ? "Disponible" : "No disponible"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
