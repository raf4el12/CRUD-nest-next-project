import { AdminProductsView } from "@/features/admin/views/AdminProductsView";

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

export default function AdminProductsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  return <AdminProductsView searchParams={props.searchParams} />;
}
