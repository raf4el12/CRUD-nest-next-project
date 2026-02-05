'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import type { StoreLocation } from '../types';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Edit from 'lucide-react/dist/esm/icons/edit';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Plus from 'lucide-react/dist/esm/icons/plus';

interface LocationsCardProps {
  locations: StoreLocation[];
  onAdd: () => void;
  onEdit: (location: StoreLocation) => void;
  onDelete: (locationId: string) => void;
  onSetDefault: (locationId: string) => void;
  className?: string;
}

export function LocationsCard({
  locations,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  className,
}: LocationsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Ubicaciones</CardTitle>
          <CardDescription>
            Gestiona las ubicaciones de tu tienda y puntos de recogida
          </CardDescription>
        </div>
        <Button onClick={onAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MapPin className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No tienes ubicaciones configuradas
            </p>
            <Button variant="link" onClick={onAdd} className="mt-2">
              Agregar tu primera ubicación
            </Button>
          </div>
        ) : (
          locations.map((location) => (
            <div
              key={location.id}
              className="flex items-start justify-between rounded-lg border p-4"
            >
              <div className="flex gap-3">
                <div className="shrink-0 mt-1">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{location.name}</h4>
                    {location.isDefault && (
                      <Badge variant="default" className="text-xs">
                        Predeterminada
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {location.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {location.city}, {location.state} {location.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {location.country}
                  </p>
                  {location.phone && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {location.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {!location.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSetDefault(location.id)}
                  >
                    Predeterminar
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(location)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(location.id)}
                  disabled={location.isDefault}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
