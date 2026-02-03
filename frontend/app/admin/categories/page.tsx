import { CategoriesView } from "@/features/admin";

type SearchParams = {
  currentPage?: string;
  pageSize?: string;
  searchValue?: string;
  orderBy?: string;
  orderByMode?: string;
  view?: "table" | "cards";
};

export default function AdminCategoriesPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <CategoriesView
      searchParams={props.searchParams}
      basePath="/admin/categories"
    />
  );
}
