import Link from "next/link";
import { Suspense } from "react";
import { fetchProductsPagination, ProductsToolbar, ProductsTable } from "@/features/products";

type SearchParams = {
  currentPage?: string;
  pageSize?: string;
  searchValue?: string;
  orderBy?: string;
  orderByMode?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
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
      <div className="rounded-xl border bg-card p-4 shadow-sm">
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

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <form
          className="grid gap-2 md:grid-cols-4"
          method="get"
          action="/admin/products"
        >
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            name="searchValue"
            defaultValue={searchValue}
            placeholder="Buscar productos..."
          />
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            name="categoryId"
            defaultValue={searchParams.categoryId ?? ""}
            placeholder="Categoría ID"
          />
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            name="minPrice"
            defaultValue={searchParams.minPrice ?? ""}
            placeholder="Precio min"
          />
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            name="maxPrice"
            defaultValue={searchParams.maxPrice ?? ""}
            placeholder="Precio max"
          />
          <input type="hidden" name="pageSize" value={pageSize} />
          <input type="hidden" name="orderBy" value={orderBy} />
          <input type="hidden" name="orderByMode" value={orderByMode} />
          <button className="rounded-md border px-3 py-2 text-sm" type="submit">
            Buscar
          </button>
        </form>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <ProductsTable products={data.data} />
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
