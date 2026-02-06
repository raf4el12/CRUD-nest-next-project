import { OrderItem } from './order-item.entity';

export class Order {
  constructor(
    readonly id: number,
    readonly customerId: number,
    readonly status: string,
    readonly paymentStatus: string,
    readonly totalAmount: number,
    readonly shippingAddress: string,
    readonly notes: string | null,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly items?: OrderItem[],
  ) {}
}
