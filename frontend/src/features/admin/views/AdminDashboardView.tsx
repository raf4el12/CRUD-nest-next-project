import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/shared/ui/card";
import ArrowDownRight from "lucide-react/dist/esm/icons/arrow-down-right";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import DollarSign from "lucide-react/dist/esm/icons/dollar-sign";
import Package from "lucide-react/dist/esm/icons/package";
import Tags from "lucide-react/dist/esm/icons/tags";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import Users from "lucide-react/dist/esm/icons/users";

const stats = [
  {
    title: "Total Ventas",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    description: "respecto al mes pasado",
    icon: DollarSign,
  },
  {
    title: "Productos Activos",
    value: "2,350",
    change: "+180",
    trend: "up",
    description: "nuevos este mes",
    icon: Package,
  },
  {
    title: "Categorías",
    value: "12",
    change: "+2",
    trend: "up",
    description: "categorías activas",
    icon: Tags,
  },
  {
    title: "Usuarios",
    value: "573",
    change: "+201",
    trend: "up",
    description: "usuarios registrados",
    icon: Users,
  },
];

const recentSales = [
  { name: "Juan Pérez", email: "juan@email.com", amount: "+$1,999.00" },
  { name: "Maria García", email: "maria@email.com", amount: "+$39.00" },
  { name: "Carlos López", email: "carlos@email.com", amount: "+$299.00" },
  { name: "Ana Martínez", email: "ana@email.com", amount: "+$99.00" },
];

export function AdminDashboardView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración. Aquí tienes un resumen general.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Resumen de Ventas
            </CardTitle>
            <CardDescription>Ventas de los últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-50 sm:h-75 flex items-center justify-center rounded-lg bg-muted/50 border-2 border-dashed">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Gráfico de Ventas</p>
                <p className="text-xs">(Próximamente)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>
              Últimas {recentSales.length} transacciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                    {sale.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{sale.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {sale.email}
                    </p>
                  </div>
                  <div className="font-medium text-sm text-green-600">
                    {sale.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
