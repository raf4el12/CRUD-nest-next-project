import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  OrderRepository,
  CreateOrderInput,
} from '../../domain/repositories/order.repository';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from '@prisma/client';
import { Pagination } from '../../../../shared/utils/value-objects/pagination.value-object';
import pagination from '../../../../shared/utils/pagination';

type OrderWithItems = PrismaOrder & { items: PrismaOrderItem[] };

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrderInput): Promise<Order> {
    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          customerId: data.customerId,
          shippingAddress: data.shippingAddress,
          notes: data.notes ?? null,
          totalAmount: data.totalAmount,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              productName: item.productName,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({
        where: { customerId: data.customerId },
      });

      return created;
    });

    return this.toDomain(order);
  }

  async findOne(id: number): Promise<Order | null> {
    const found = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findByCustomerId(
    customerId: number,
    queryPagination: Pagination,
  ): Promise<any> {
    const { currentPage, pageSize, orderBy, orderByMode } = queryPagination;
    const dynamicOrderBy = {
      [orderBy || 'createdAt']: orderByMode || 'desc',
    };
    const { limit, offset } = pagination.getPagination(currentPage, pageSize);

    const where = { customerId };

    const [items, count] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: [dynamicOrderBy],
        take: limit,
        skip: offset,
      }),
      this.prisma.order.count({ where }),
    ]);

    const dataResponse = {
      rows: items.map((item) => this.toDomain(item)),
      count,
    };

    return pagination.getDataPagination(dataResponse, currentPage, limit);
  }

  async findAllPagination(
    queryPagination: Pagination,
    filters?: { status?: string },
  ): Promise<any> {
    const { currentPage, pageSize, orderBy, orderByMode } = queryPagination;
    const dynamicOrderBy = {
      [orderBy || 'createdAt']: orderByMode || 'desc',
    };
    const { limit, offset } = pagination.getPagination(currentPage, pageSize);

    const where: any = {};
    if (filters?.status) {
      where.status = filters.status;
    }

    const [items, count] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: [dynamicOrderBy],
        take: limit,
        skip: offset,
      }),
      this.prisma.order.count({ where }),
    ]);

    const dataResponse = {
      rows: items.map((item) => this.toDomain(item)),
      count,
    };

    return pagination.getDataPagination(dataResponse, currentPage, limit);
  }

  async updateStatus(id: number, status: string): Promise<Order | null> {
    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: { items: true },
    });
    return this.toDomain(updated);
  }

  private toDomain(order: OrderWithItems): Order {
    return new Order(
      order.id,
      order.customerId,
      order.status,
      order.paymentStatus,
      order.totalAmount,
      order.shippingAddress,
      order.notes ?? null,
      order.createdAt,
      order.updatedAt,
      order.items?.map(
        (item) =>
          new OrderItem(
            item.id,
            item.orderId,
            item.productId,
            item.quantity,
            item.unitPrice,
            item.productName,
            item.createdAt,
          ),
      ),
    );
  }
}
