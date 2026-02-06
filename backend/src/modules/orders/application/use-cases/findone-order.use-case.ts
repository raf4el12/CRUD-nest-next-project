import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../domain/repositories/order.repository';
import { Order } from '../../domain/entities/order.entity';

@Injectable()
export class FindOneOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepository,
  ) {}

  async execute(
    orderId: number,
    customerId: number,
    role: string,
  ): Promise<Order> {
    const order = await this.repository.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (role !== 'ADMIN' && order.customerId !== customerId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }
}
