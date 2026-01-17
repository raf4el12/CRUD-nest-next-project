import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY, CategoryRepository } from '../../domain/repositories/category.repository';
import { FindAllCategoryDto } from '../dto/findall-category.dto';
import { Category } from '../../domain/entities/category.entity';

@Injectable()
export class FindAllCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repository: CategoryRepository,
  ) {}

  execute(filters: FindAllCategoryDto): Promise<Category[] | null> {
    return this.repository.findAll({
      search: filters.search,
      skip: filters.skip,
      take: filters.take,
    });
  }
}
