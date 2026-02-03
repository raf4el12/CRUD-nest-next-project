/**
 * Shared types used across multiple features
 */

export interface PaginatedResponse<T> {
  totalItems: number;
  data: T[];
  totalPages: number;
  currentPage: number;
}

export type UserRole = "ADMIN" | "CUSTOMER" | "SUPPORT";
