import { Order } from '../entities/order.entity';
import { Pagination } from '../../../../shared/utils/value-objects/pagination.value-object';

export const ORDER_REPOSITORY = 'OrderRepository';

export interface CreateOrderInput {
  customerId: number;
  shippingAddress: string;
  notes?: string | null;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
    productName: string;
  }[];
  totalAmount: number;
}

export interface OrderRepository {
  create(data: CreateOrderInput): Promise<Order>;
  findOne(id: number): Promise<Order | null>;
  findByCustomerId(
    customerId: number,
    pagination: Pagination,
  ): Promise<any>;
  findAllPagination(
    pagination: Pagination,
    filters?: { status?: string },
  ): Promise<any>;
  updateStatus(id: number, status: string): Promise<Order | null>;
}
