'use client';

import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';
import Users from 'lucide-react/dist/esm/icons/users';
import UserCheck from 'lucide-react/dist/esm/icons/user-check';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import type { CustomerStats } from '../types';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                <TrendingUp className={cn(
                  "h-3 w-3",
                  !trend.isPositive && "rotate-180"
                )} />
                <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              </div>
            )}
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CustomerStatsCardsProps {
  stats: CustomerStats;
  className?: string;
}

export function CustomerStatsCards({ stats, className }: CustomerStatsCardsProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      <StatCard
        title="Total Clientes"
        value={stats.totalCustomers.toLocaleString('es-ES')}
        icon={Users}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Clientes Activos"
        value={stats.activeCustomers.toLocaleString('es-ES')}
        description={`${Math.round((stats.activeCustomers / stats.totalCustomers) * 100)}% del total`}
        icon={UserCheck}
      />
      <StatCard
        title="Nuevos Este Mes"
        value={stats.newCustomersThisMonth}
        icon={UserPlus}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        title="Valor Promedio"
        value={`$${stats.avgOrderValue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`}
        description="Por orden"
        icon={TrendingUp}
      />
    </div>
  );
}
