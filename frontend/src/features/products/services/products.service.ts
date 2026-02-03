import { apiClient } from "@/shared/api";
import { Product } from "../types";
import { ProductFormValues } from "../validators/product";
import { PaginatedResponse } from "@/shared/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const productsService = {
  async createProduct(payload: ProductFormValues): Promise<Product> {
    const response = await apiClient.post<Product>("/products", payload);
    return response.data;
  },

  async updateProduct(id: number, payload: ProductFormValues): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}`, payload);
    return response.data;
  },
};

/**
 * Server-side fetch for products pagination (SSR/RSC compatible)
 */
export async function fetchProductsPagination(params: {
  currentPage?: number;
  pageSize?: number;
  searchValue?: string;
  orderBy?: string;
  orderByMode?: string;
  categoryId?: number;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
}): Promise<PaginatedResponse<Product>> {
  const qs = new URLSearchParams();
  if (params.currentPage) qs.set("currentPage", String(params.currentPage));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params.searchValue) qs.set("searchValue", params.searchValue);
  if (params.orderBy) qs.set("orderBy", params.orderBy);
  if (params.orderByMode) qs.set("orderByMode", params.orderByMode);
  if (params.categoryId !== undefined) qs.set("categoryId", String(params.categoryId));
  if (params.isAvailable !== undefined) qs.set("isAvailable", String(params.isAvailable));
  if (params.minPrice !== undefined) qs.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) qs.set("maxPrice", String(params.maxPrice));

  const res = await fetch(`${API_BASE}/products/pagination?${qs.toString()}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json() as Promise<PaginatedResponse<Product>>;
}
