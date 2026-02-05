'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Switch } from '@/shared/ui/switch';
import { Label } from '@/shared/ui/label';
import type { NotificationSetting } from '../types';

interface NotificationsCardProps {
  settings: NotificationSetting[];
  onChange: (settingId: string, field: 'email' | 'push', value: boolean) => void;
  className?: string;
}

export function NotificationsCard({ 
  settings, 
  onChange,
  className 
}: NotificationsCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Notificaciones</CardTitle>
        <CardDescription>
          Configura qué notificaciones deseas recibir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_80px] gap-4 border-b pb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Tipo de Notificación
            </span>
            <span className="text-sm font-medium text-muted-foreground text-center">
              Email
            </span>
            <span className="text-sm font-medium text-muted-foreground text-center">
              Push
            </span>
          </div>

          {/* Settings */}
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="grid grid-cols-[1fr_80px_80px] gap-4 items-center py-2"
            >
              <div>
                <Label className="font-medium">{setting.title}</Label>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={setting.email}
                  onCheckedChange={(checked) => 
                    onChange(setting.id, 'email', checked)
                  }
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={setting.push}
                  onCheckedChange={(checked) => 
                    onChange(setting.id, 'push', checked)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
