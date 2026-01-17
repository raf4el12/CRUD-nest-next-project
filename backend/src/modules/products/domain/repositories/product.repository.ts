import { Product } from '../entities/product.entity';
import { Pagination } from '../../../../shared/utils/value-objects/pagination.value-object';

export const PRODUCT_REPOSITORY = 'ProductRepository';

export interface ProductRepository {
  create(data: Partial<Product>): Promise<Product | null>;
  findOne(data: Partial<Product>): Promise<Product | null>;
  findAllPagination(
    queryPagination: Pagination,
    filters?: {
      categoryId?: number;
      isAvailable?: boolean;
      minPrice?: number;
      maxPrice?: number;
    },
  ): Promise<any>;
  update(id: number, data: Partial<Product>): Promise<Product | null>;
  softDelete(id: number): Promise<{ message: string; entity: Product | null }>;
}
