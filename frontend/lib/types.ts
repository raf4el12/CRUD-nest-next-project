export type UserRole = "ADMIN" | "CUSTOMER" | "SUPPORT";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  photo: string | null;
  documentType: string | null;
  documentNumber: string | null;
}

export interface UserCustomer {
  id: number;
  userId: number;
  points: number;
  level: string;
  newsletter: boolean;
  shippingAddress: string | null;
  billingAddress: string | null;
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile | null;
  customer?: UserCustomer | null;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  deletedAt: string | null;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  totalItems: number;
  data: T[];
  totalPages: number;
  currentPage: number;
}
