'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import type { ShippingActivity } from '../types';
import { cn } from '@/shared/lib/utils';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Circle from 'lucide-react/dist/esm/icons/circle';

interface ShippingActivityCardProps {
  activities: ShippingActivity[];
  className?: string;
}

export function ShippingActivityCard({ activities, className }: ShippingActivityCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Actividad de Envío</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {activities.map((activity, index) => {
            const isLast = index === activities.length - 1;
            const isCompleted = activity.isCompleted;

            return (
              <div key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Timeline Line */}
                {!isLast && (
                  <div
                    className={cn(
                      'absolute left-[11px] top-6 h-full w-0.5',
                      isCompleted ? 'bg-primary' : 'border-l-2 border-dashed border-muted-foreground/30'
                    )}
                  />
                )}

                {/* Timeline Dot */}
                <div className="relative z-10 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground/50" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 mb-1">
                    <p className={cn(
                      'font-medium text-sm',
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {activity.title}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString('es-ES', {
                        weekday: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
