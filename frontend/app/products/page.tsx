import Link from "next/link";
import { Suspense } from "react";
import { fetchProductsPagination } from "@/features/products";

type SearchParams = {
  currentPage?: string;
  pageSize?: string;
  searchValue?: string;
  orderBy?: string;
  orderByMode?: string;
  categoryId?: string;
  isAvailable?: string;
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

export default function ProductsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-4">
        <h1 className="text-xl font-semibold">Products</h1>

        <Suspense fallback={<ProductsFallback />}>
          <ProductsContent searchParamsPromise={props.searchParams} />
        </Suspense>
      </section>
    </div>
  );
}

function ProductsFallback() {
  return (
    <div className="space-y-4">
      <div className="h-24 w-full rounded-md bg-muted/60 animate-pulse" />
      <div className="h-32 w-full rounded-md bg-muted/60 animate-pulse" />
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

  const prevQuery = buildQuery({
    currentPage: Math.max(1, page - 1),
    pageSize,
    searchValue,
    orderBy,
    orderByMode,
    categoryId,
    minPrice,
    maxPrice,
  });
  const nextQuery = buildQuery({
    currentPage: page + 1,
    pageSize,
    searchValue,
    orderBy,
    orderByMode,
    categoryId,
    minPrice,
    maxPrice,
  });

  return (
    <>
      <form className="grid gap-2 md:grid-cols-4" method="get" action="/products">
        <input
          className="rounded-md border px-3 py-2 text-sm"
          name="searchValue"
          defaultValue={searchValue}
          placeholder="Buscar..."
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          name="categoryId"
          defaultValue={searchParams.categoryId ?? ""}
          placeholder="Category ID"
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          name="minPrice"
          defaultValue={searchParams.minPrice ?? ""}
          placeholder="Min price"
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          name="maxPrice"
          defaultValue={searchParams.maxPrice ?? ""}
          placeholder="Max price"
        />
        <input type="hidden" name="pageSize" value={pageSize} />
        <input type="hidden" name="orderBy" value={orderBy} />
        <input type="hidden" name="orderByMode" value={orderByMode} />
        <button className="rounded-md border px-3 py-2 text-sm" type="submit">
          Buscar
        </button>
      </form>

      <ul className="space-y-2">
        {data.data.map((p) => (
          <li key={p.id} className="rounded-md border px-3 py-2 text-sm">
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-muted-foreground">{p.description}</div>
            <div className="text-xs">Precio: {p.price}</div>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Link
          className="rounded-md border px-3 py-2 text-sm"
          href={`/products?${prevQuery}`}
          aria-disabled={page <= 1}
        >
          Prev
        </Link>
        <span className="text-sm">
          Página {data.currentPage} / {data.totalPages}
        </span>
        <Link
          className="rounded-md border px-3 py-2 text-sm"
          href={`/products?${nextQuery}`}
          aria-disabled={page >= data.totalPages}
        >
          Next
        </Link>
      </div>
    </>
  );
}
