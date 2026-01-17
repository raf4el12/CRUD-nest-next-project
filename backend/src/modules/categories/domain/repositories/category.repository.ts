import { Category } from '../entities/category.entity';
import { Pagination } from '../../../../shared/utils/value-objects/pagination.value-object';

export const CATEGORY_REPOSITORY = 'CategoryRepository';

export interface CategoryRepository {
  create(data: Partial<Category>): Promise<Category | null>;
  findOne(data: Partial<Category>): Promise<Category | null>;
  findAllPagination(queryPagination: Pagination): Promise<any>;
  update(id: number, data: Partial<Category>): Promise<Category | null>;
  delete(id: number): Promise<{ message: string; entity: Category | null }>;
}
