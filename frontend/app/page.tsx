import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Plataforma e-commerce
            </div>
            <div className="space-y-4">
              <h1>Tu tienda, clara y veloz desde el primer clic.</h1>
              <p className="text-base text-muted-foreground max-w-2xl">
                Gestiona categorías y productos con una experiencia pulida. Inicia sesión para acceder y, si eres admin,
                entra directo al dashboard para controlar el catálogo y las operaciones.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">Crear cuenta</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/products">Explorar catálogo</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Resumen</p>
                <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">Actualizado hoy</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border bg-background px-4 py-3">
                  <p className="text-xs text-muted-foreground">Categorías activas</p>
                  <p className="text-2xl font-semibold">12</p>
                </div>
                <div className="rounded-xl border bg-background px-4 py-3">
                  <p className="text-xs text-muted-foreground">Productos publicados</p>
                  <p className="text-2xl font-semibold">2,350</p>
                </div>
                <div className="rounded-xl border bg-background px-4 py-3">
                  <p className="text-xs text-muted-foreground">Pedidos en revisión</p>
                  <p className="text-2xl font-semibold">18</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Auth</p>
            <h2 className="mt-3">Acceso seguro</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Control de roles y rutas protegidas para que cada usuario vea solo lo que necesita.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Productos</p>
            <h2 className="mt-3">Catálogo ordenado</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Paginación server-side y filtros claros para mantener el inventario bajo control.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Categorías</p>
            <h2 className="mt-3">Organización precisa</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Estructura tus colecciones con vistas de tabla o cards para una lectura cómoda.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}