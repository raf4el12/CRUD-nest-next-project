import { Category } from '../entities/category.entity';

export const CATEGORY_REPOSITORY = 'CategoryRepository';

export interface CategoryRepository {
  create(data: Partial<Category>): Promise<Category | null>;
  findOne(data: Partial<Category>): Promise<Category | null>;
  findAll(filters: { search?: string; skip?: number; take?: number }): Promise<Category[] | null>;
  update(id: number, data: Partial<Category>): Promise<Category | null>;
  delete(id: number): Promise<{ message: string; entity: Category | null }>;
}
