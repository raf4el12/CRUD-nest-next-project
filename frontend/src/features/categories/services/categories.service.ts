import { apiClient } from "@/shared/api";
import { Category } from "../types";
import { CategoryFormValues } from "../validators/category";
import { PaginatedResponse } from "@/shared/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const categoriesService = {
  async createCategory(payload: CategoryFormValues): Promise<Category> {
    const response = await apiClient.post<Category>("/categories", payload);
    return response.data;
  },

  async updateCategory(id: number, payload: CategoryFormValues): Promise<Category> {
    const response = await apiClient.patch<Category>(`/categories/${id}`, payload);
    return response.data;
  },
};

/**
 * Server-side fetch for categories pagination (SSR/RSC compatible)
 */
export async function fetchCategoriesPagination(params: {
  currentPage?: number;
  pageSize?: number;
  searchValue?: string;
  orderBy?: string;
  orderByMode?: string;
}): Promise<PaginatedResponse<Category>> {
  const qs = new URLSearchParams();
  if (params.currentPage) qs.set("currentPage", String(params.currentPage));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params.searchValue) qs.set("searchValue", params.searchValue);
  if (params.orderBy) qs.set("orderBy", params.orderBy);
  if (params.orderByMode) qs.set("orderByMode", params.orderByMode);

  const res = await fetch(`${API_BASE}/categories/pagination?${qs.toString()}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json() as Promise<PaginatedResponse<Category>>;
}
