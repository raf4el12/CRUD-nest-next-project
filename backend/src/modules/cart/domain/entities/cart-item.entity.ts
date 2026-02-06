export class CartItem {
  constructor(
    readonly id: number,
    readonly customerId: number,
    readonly productId: number,
    readonly quantity: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly product?: {
      name: string;
      price: number;
      image: string | null;
      stock: number;
      isAvailable: boolean;
    } | null,
  ) {}
}
