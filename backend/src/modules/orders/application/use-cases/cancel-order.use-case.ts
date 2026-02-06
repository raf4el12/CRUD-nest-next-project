import {
  BadRequestException,
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
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(orderId: number, customerId: number): Promise<Order> {
    const order = await this.repository.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.customerId !== customerId) {
      throw new ForbiddenException('Access denied');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException('Only PENDING orders can be cancelled');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });

      if (order.items) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    });

    return (await this.repository.findOne(orderId))!;
  }
}
