import Link from "next/link";
import { Suspense } from "react";
import { CategoriesToolbar } from "@/features/categories/components/CategoriesToolbar";
import { CategoriesTable } from "@/features/categories/components/CategoriesTable";
import { CategoryCards } from "@/features/categories/components/CategoryCards";
import { fetchCategoriesPagination } from "@/features/categories/services/categories.service";

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
  const isAdmin = basePath.startsWith("/admin");

  const content = (
    <section className="space-y-6">
      {!isAdmin && (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Categorías</h1>
          <p className="text-sm text-muted-foreground">
            Administra las categorías con vistas de tabla o cards.
          </p>
        </div>
      )}

      <div className="rounded-lg border-2 border-border bg-card p-4 shadow-sm">
        <CategoriesToolbar />
      </div>

      <Suspense fallback={<CategoriesFallback />}>
        <CategoriesContent
          searchParamsPromise={props.searchParams}
          basePath={basePath}
        />
      </Suspense>
    </section>
  );

  if (isAdmin) {
    return content;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {content}
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
      <div className="rounded-lg border-2 border-border bg-card p-4 shadow-[0_1px_12px_rgba(15,23,42,0.06)]">
        <form
          className="grid gap-2 md:grid-cols-4"
          method="get"
          action={props.basePath}
        >
          <label className="sr-only" htmlFor="categories-search">
            Buscar categorías
          </label>
          <input
            id="categories-search"
            type="search"
            className="h-9 md:col-span-2 rounded-md border-2 border-input bg-background px-3 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
              href={`${props.basePath}?${buildQuery({
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
              href={`${props.basePath}?${buildQuery({
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
