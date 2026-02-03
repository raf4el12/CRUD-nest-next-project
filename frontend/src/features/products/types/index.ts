/**
 * Products Feature - Types
 */

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
