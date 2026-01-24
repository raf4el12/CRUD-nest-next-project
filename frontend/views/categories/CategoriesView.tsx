import Link from "next/link";
import { Suspense } from "react";
import { fetchCategoriesPagination } from "@/lib/api";
import { CategoriesToolbar } from "@/components/categories/components/CategoriesToolbar";
import { CategoriesTable } from "@/components/categories/components/CategoriesTable";
import { CategoryCards } from "@/components/categories/components/CategoryCards";

type SearchParams = {
  currentPage?: string;
  pageSize?: string;
  searchValue?: string;
  orderBy?: string;
  orderByMode?: string;
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

export function CategoriesView(props: {
  searchParams: Promise<SearchParams>;
  basePath?: string;
}) {
  const basePath = props.basePath ?? "/categories";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Categorías</h1>
          <p className="text-sm text-muted-foreground">
            Administra las categorías con vistas de tabla o cards.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <CategoriesToolbar />
        </div>

        <Suspense fallback={<CategoriesFallback />}>
          <CategoriesContent
            searchParamsPromise={props.searchParams}
            basePath={basePath}
          />
        </Suspense>
      </section>
    </div>
  );
}

function CategoriesFallback() {
  return (
    <div className="space-y-4">
      <div className="h-12 w-full rounded-xl bg-muted/60 animate-pulse" />
      <div className="h-64 w-full rounded-xl bg-muted/60 animate-pulse" />
    </div>
  );
}

async function CategoriesContent(props: {
  searchParamsPromise: Promise<SearchParams>;
  basePath: string;
}) {
  const searchParams = await props.searchParamsPromise;
  const page = Number(searchParams.currentPage ?? "1");
  const pageSize = Number(searchParams.pageSize ?? "10");
  const searchValue = searchParams.searchValue ?? "";
  const orderBy = searchParams.orderBy ?? "createdAt";
  const orderByMode = searchParams.orderByMode ?? "desc";
  const view = searchParams.view ?? "table";

  const data = await fetchCategoriesPagination({
    currentPage: page,
    pageSize,
    searchValue: searchValue || undefined,
    orderBy,
    orderByMode,
  });

  const baseQuery = {
    pageSize,
    searchValue,
    orderBy,
    orderByMode,
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
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold">Listado</h2>
            <p className="text-sm text-muted-foreground">{totalItemsLabel}</p>
          </div>

          <form
            className="flex flex-1 flex-wrap gap-2 lg:justify-end"
            method="get"
            action={props.basePath}
          >
            <label className="sr-only" htmlFor="categories-search">
              Buscar categorías
            </label>
            <input
              id="categories-search"
              type="search"
              className="min-w-55 flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              name="searchValue"
              defaultValue={searchValue}
              placeholder="Buscar categorías..."
              autoComplete="off"
              spellCheck={false}
            />
            <input type="hidden" name="pageSize" value={pageSize} />
            <input type="hidden" name="orderBy" value={orderBy} />
            <input type="hidden" name="orderByMode" value={orderByMode} />
            <input type="hidden" name="view" value={view} />
            <button className="rounded-md border px-3 py-2 text-sm" type="submit">
              Buscar
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Link
              aria-current={view === "table" ? "page" : undefined}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                view === "table"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              href={`${props.basePath}?${buildQuery({
                ...baseQuery,
                view: "table",
                currentPage: page,
              })}`}
            >
              Tabla
            </Link>
            <Link
              aria-current={view === "cards" ? "page" : undefined}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                view === "cards"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              href={`${props.basePath}?${buildQuery({
                ...baseQuery,
                view: "cards",
                currentPage: page,
              })}`}
            >
              Cards
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        {view === "cards" ? (
          <CategoryCards categories={data.data} />
        ) : (
          <CategoriesTable categories={data.data} />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          className={`rounded-md border px-3 py-2 text-sm ${
            isPrevDisabled ? "pointer-events-none opacity-50" : ""
          }`}
          href={`${props.basePath}?${prevQuery}`}
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
          href={`${props.basePath}?${nextQuery}`}
          aria-disabled={isNextDisabled}
          tabIndex={isNextDisabled ? -1 : undefined}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
