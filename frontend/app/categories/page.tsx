import { CategoriesView } from "@/views/categories/CategoriesView";

type SearchParams = {
  currentPage?: string;
  pageSize?: string;
  searchValue?: string;
  orderBy?: string;
  orderByMode?: string;
  view?: "table" | "cards";
};

export default function CategoriesPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <CategoriesView searchParams={props.searchParams} basePath="/categories" />
  );
}
