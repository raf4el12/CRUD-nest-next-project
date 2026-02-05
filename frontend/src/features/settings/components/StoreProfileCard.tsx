'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import type { StoreProfile } from '../types';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';

interface StoreProfileCardProps {
  profile: StoreProfile;
  onChange: (profile: StoreProfile) => void;
  className?: string;
}

export function StoreProfileCard({ profile, onChange, className }: StoreProfileCardProps) {
  const handleChange = (field: keyof StoreProfile, value: string) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Perfil de Tienda</CardTitle>
        <CardDescription>
          Información básica de tu tienda que se mostrará a los clientes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="storeName">Nombre de la Tienda</Label>
            <Input
              id="storeName"
              value={profile.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              placeholder="Mi Tienda"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email de Contacto</Label>
            <Input
              id="contactEmail"
              type="email"
              value={profile.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder="contacto@mitienda.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderEmail">Email de Envío</Label>
            <Input
              id="senderEmail"
              type="email"
              value={profile.senderEmail}
              onChange={(e) => handleChange('senderEmail', e.target.value)}
              placeholder="no-reply@mitienda.com"
            />
          </div>
        </div>

        {profile.senderEmail && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Confirma que tienes acceso a <strong>{profile.senderEmail}</strong> en la configuración de email de envío.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
