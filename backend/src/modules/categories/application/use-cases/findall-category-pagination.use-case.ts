import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY, CategoryRepository } from '../../domain/repositories/category.repository';
import { Pagination } from '../../../../shared/utils/value-objects/pagination.value-object';
import { PaginationCategoryDto } from '../dto/pagination-category.dto';

@Injectable()
export class FindAllCategoryPaginationUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repository: CategoryRepository,
  ) {}

  execute(queryPagination: PaginationCategoryDto): Promise<any> {
    const pagination = new Pagination(
      queryPagination.searchValue,
      queryPagination.currentPage,
      queryPagination.pageSize,
      queryPagination.orderBy,
      queryPagination.orderByMode,
    );

    return this.repository.findAllPagination(pagination);
  }
}
