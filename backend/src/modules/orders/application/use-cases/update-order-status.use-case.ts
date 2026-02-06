import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../domain/repositories/order.repository';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { Order } from '../../domain/entities/order.entity';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepository,
  ) {}

  async execute(id: number, dto: UpdateOrderStatusDto): Promise<Order | null> {
    const order = await this.repository.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return this.repository.updateStatus(id, dto.status);
  }
}
