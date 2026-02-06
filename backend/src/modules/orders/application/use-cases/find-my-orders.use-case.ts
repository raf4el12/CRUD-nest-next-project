import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../domain/repositories/order.repository';
import { Pagination } from '../../../../shared/utils/value-objects/pagination.value-object';
import { PaginationOrderDto } from '../dto/pagination-order.dto';

@Injectable()
export class FindMyOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepository,
  ) {}

  execute(customerId: number, queryPagination: PaginationOrderDto): Promise<any> {
    const pagination = new Pagination(
      undefined,
      queryPagination.currentPage,
      queryPagination.pageSize,
      queryPagination.orderBy,
      queryPagination.orderByMode,
    );
    return this.repository.findByCustomerId(customerId, pagination);
  }
}
