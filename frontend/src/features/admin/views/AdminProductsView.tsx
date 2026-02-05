import Link from "next/link";
import { Suspense } from "react";
import { ProductsToolbar } from "@/features/products/components/ProductsToolbar";
import { ProductsTable } from "@/features/products/components/ProductsTable";
import { fetchProductsPagination } from "@/features/products/services/products.service";
import type { Product } from "@/features/products/types";
import ImageOff from "lucide-react/dist/esm/icons/image-off";

type SearchParams = {
  currentPage?: string;
  pageSize?: string;
  searchValue?: string;
  orderBy?: string;
  orderByMode?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  view?: "table" | "cards";
};

function buildQuery(params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      qs.set(key, String(value));
    }
  });
  return qs.toString();
}

export function AdminProductsView(props: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border-2 border-border bg-card p-4 shadow-sm">
        <ProductsToolbar />
      </div>

      <Suspense fallback={<ProductsLoading />}>
        <ProductsContent searchParamsPromise={props.searchParams} />
      </Suspense>
    </section>
  );
}

function ProductsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-12 w-full rounded-xl bg-muted/60 animate-pulse" />
      <div className="h-64 w-full rounded-xl bg-muted/60 animate-pulse" />
    </div>
  );
}

async function ProductsContent(props: {
  searchParamsPromise: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParamsPromise;
  const page = Number(searchParams.currentPage ?? "1");
  const pageSize = Number(searchParams.pageSize ?? "10");
  const searchValue = searchParams.searchValue ?? "";
  const orderBy = searchParams.orderBy ?? "createdAt";
  const orderByMode = searchParams.orderByMode ?? "desc";
  const categoryId = searchParams.categoryId ? Number(searchParams.categoryId) : undefined;
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const view = searchParams.view ?? "table";

  const data = await fetchProductsPagination({
    currentPage: page,
    pageSize,
    searchValue: searchValue || undefined,
    categoryId,
    minPrice,
    maxPrice,
    orderBy,
    orderByMode,
  });

  const baseQuery = {
    pageSize,
    searchValue,
    orderBy,
    orderByMode,
    categoryId,
    minPrice,
    maxPrice,
    view,
  };

  const prevQuery = buildQuery({
    ...baseQuery,
    currentPage: Math.max(1, page - 1),
  });
  const nextQuery = buildQuery({
    ...baseQuery,
    currentPage: page + 1,
  });

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= data.totalPages;
  const totalItemsLabel = `${data.totalItems} ${
    data.totalItems === 1 ? "resultado" : "resultados"
  }`;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-border bg-card p-4 shadow-[0_1px_12px_rgba(15,23,42,0.06)]">
        <form
          className="grid gap-2 md:grid-cols-4"
          method="get"
          action="/admin/products"
        >
          <input
            className="h-9 rounded-md border-2 border-input bg-background px-3 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            name="searchValue"
            defaultValue={searchValue}
            placeholder="Buscar productos..."
          />
          <input
            className="h-9 rounded-md border-2 border-input bg-background px-3 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            name="categoryId"
            defaultValue={searchParams.categoryId ?? ""}
            placeholder="Categoría ID"
          />
          <input
            className="h-9 rounded-md border-2 border-input bg-background px-3 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            name="minPrice"
            defaultValue={searchParams.minPrice ?? ""}
            placeholder="Precio min"
          />
          <input
            className="h-9 rounded-md border-2 border-input bg-background px-3 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            name="maxPrice"
            defaultValue={searchParams.maxPrice ?? ""}
            placeholder="Precio max"
          />
          <input type="hidden" name="pageSize" value={pageSize} />
          <input type="hidden" name="orderBy" value={orderBy} />
          <input type="hidden" name="orderByMode" value={orderByMode} />
          <input type="hidden" name="view" value={view} />
          <button
            className="h-10 rounded-[10px] border-2 border-input bg-background px-4 text-[11px] font-semibold uppercase tracking-[0.2em] shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            type="submit"
          >
            Buscar
          </button>
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
            <Link
              aria-current={view === "table" ? "page" : undefined}
              className={`h-10 flex-1 rounded-[10px] border-2 border-input px-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors md:flex-none ${
                view === "table"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
              href={`/admin/products?${buildQuery({
                ...baseQuery,
                view: "table",
                currentPage: page,
              })}`}
            >
              <span className="flex h-full w-full items-center justify-center">Tabla</span>
            </Link>
            <Link
              aria-current={view === "cards" ? "page" : undefined}
              className={`h-10 flex-1 rounded-[10px] border-2 border-input px-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors md:flex-none ${
                view === "cards"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
              href={`/admin/products?${buildQuery({
                ...baseQuery,
                view: "cards",
                currentPage: page,
              })}`}
            >
              <span className="flex h-full w-full items-center justify-center">Cards</span>
            </Link>
          </div>
          <p className="md:col-span-4 text-sm text-muted-foreground">
            {totalItemsLabel}
          </p>
        </form>
      </div>

      <div className="rounded-lg border-2 border-border bg-card p-4 shadow-sm">
        {view === "cards" ? (
          <ProductsCards products={data.data} />
        ) : (
          <ProductsTable products={data.data} />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          className={`rounded-md border px-3 py-2 text-sm ${
            isPrevDisabled ? "pointer-events-none opacity-50" : ""
          }`}
          href={`/admin/products?${prevQuery}`}
          aria-disabled={isPrevDisabled}
          tabIndex={isPrevDisabled ? -1 : undefined}
        >
          Prev
        </Link>
        <span className="text-sm text-muted-foreground">
          Página {data.currentPage} / {data.totalPages}
        </span>
        <Link
          className={`rounded-md border px-3 py-2 text-sm ${
            isNextDisabled ? "pointer-events-none opacity-50" : ""
          }`}
          href={`/admin/products?${nextQuery}`}
          aria-disabled={isNextDisabled}
          tabIndex={isNextDisabled ? -1 : undefined}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

function ProductsCards({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No hay productos aún. Crea uno nuevo para empezar.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-lg border-2 border-border bg-background p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Producto
              </p>
              <h3 className="mt-2 text-sm font-semibold tracking-tight">
                {product.name}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border-2 border-border bg-muted/40">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <ImageOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">${product.price}</span>
            <span>
              {product.isAvailable ? "Disponible" : "No disponible"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
