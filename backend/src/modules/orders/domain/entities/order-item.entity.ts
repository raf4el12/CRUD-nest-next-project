export class OrderItem {
  constructor(
    readonly id: number,
    readonly orderId: number,
    readonly productId: number,
    readonly quantity: number,
    readonly unitPrice: number,
    readonly productName: string,
    readonly createdAt: Date,
  ) {}
}
