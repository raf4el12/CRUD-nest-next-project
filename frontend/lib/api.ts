import type {
  AuthTokens,
  Category,
  PaginatedResponse,
  Product,
  User,
  UserRole,
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function request<T>(
  path: string,
  init?: RequestInit,
  accessToken?: string,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json() as Promise<T>;
}

export function register(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}) {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return request<AuthTokens>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function refresh(payload: { refreshToken: string }) {
  return request<AuthTokens>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout(payload: { refreshToken: string }) {
  return request<{ message: string }>("/auth/logout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function me(accessToken: string) {
  return request<User>("/auth/me", { method: "GET" }, accessToken);
}

export function fetchCategoriesPagination(params: {
  currentPage?: number;
  pageSize?: number;
  searchValue?: string;
  orderBy?: string;
  orderByMode?: string;
}) {
  const qs = new URLSearchParams();
  if (params.currentPage) qs.set("currentPage", String(params.currentPage));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params.searchValue) qs.set("searchValue", params.searchValue);
  if (params.orderBy) qs.set("orderBy", params.orderBy);
  if (params.orderByMode) qs.set("orderByMode", params.orderByMode);

  return request<PaginatedResponse<Category>>(
    `/categories/pagination?${qs.toString()}`,
    { method: "GET" },
  );
}

export function fetchProductsPagination(params: {
  currentPage?: number;
  pageSize?: number;
  searchValue?: string;
  orderBy?: string;
  orderByMode?: string;
  categoryId?: number;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
}) {
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

  return request<PaginatedResponse<Product>>(
    `/products/pagination?${qs.toString()}`,
    { method: "GET" },
  );
}
