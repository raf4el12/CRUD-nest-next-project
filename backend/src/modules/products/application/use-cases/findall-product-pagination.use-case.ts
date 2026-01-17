import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../domain/repositories/product.repository';
import { Pagination } from '../../../../shared/utils/value-objects/pagination.value-object';
import { PaginationProductDto } from '../dto/pagination-product.dto';

@Injectable()
export class FindAllProductPaginationUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository,
  ) {}

  execute(queryPagination: PaginationProductDto): Promise<any> {
    const pagination = new Pagination(
      queryPagination.searchValue,
      queryPagination.currentPage,
      queryPagination.pageSize,
      queryPagination.orderBy,
      queryPagination.orderByMode,
    );

    return this.repository.findAllPagination(pagination, {
      categoryId: queryPagination.categoryId,
      isAvailable: queryPagination.isAvailable,
      minPrice: queryPagination.minPrice,
      maxPrice: queryPagination.maxPrice,
    });
  }
}
