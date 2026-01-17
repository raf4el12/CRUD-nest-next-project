import { Product } from '../entities/product.entity';

export const PRODUCT_REPOSITORY = 'ProductRepository';

export interface ProductRepository {
  create(data: Partial<Product>): Promise<Product | null>;
  findOne(data: Partial<Product>): Promise<Product | null>;
  findAll(filters: {
    search?: string;
    categoryId?: number;
    isAvailable?: boolean;
    minPrice?: number;
    maxPrice?: number;
    skip?: number;
    take?: number;
  }): Promise<Product[] | null>;
  update(id: number, data: Partial<Product>): Promise<Product | null>;
  softDelete(id: number): Promise<{ message: string; entity: Product | null }>;
}
