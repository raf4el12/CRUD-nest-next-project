'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Switch } from '@/shared/ui/switch';
import { Badge } from '@/shared/ui/badge';
import type { PaymentProvider } from '../types';
import Settings from 'lucide-react/dist/esm/icons/settings';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

interface PaymentProvidersCardProps {
  providers: PaymentProvider[];
  onToggle: (providerId: string, enabled: boolean) => void;
  onConfigure: (provider: PaymentProvider) => void;
  className?: string;
}

export function PaymentProvidersCard({ 
  providers, 
  onToggle, 
  onConfigure,
  className 
}: PaymentProvidersCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Proveedores de Pago</CardTitle>
        <CardDescription>
          Configura los métodos de pago disponibles para tus clientes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              {provider.icon ? (
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  <img 
                    src={provider.icon} 
                    alt={provider.name} 
                    className="h-6 w-6 object-contain"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {provider.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{provider.name}</h4>
                  {provider.isConfigured ? (
                    <Badge variant="outline" className="text-xs">Configurado</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Sin configurar</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {provider.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onConfigure(provider)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Switch
                checked={provider.isEnabled}
                onCheckedChange={(checked) => onToggle(provider.id, checked)}
                disabled={!provider.isConfigured}
              />
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full">
          <ExternalLink className="mr-2 h-4 w-4" />
          Ver más proveedores
        </Button>
      </CardContent>
    </Card>
  );
}
