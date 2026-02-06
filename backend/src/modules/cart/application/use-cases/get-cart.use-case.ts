import { Inject, Injectable } from '@nestjs/common';
import {
  CART_REPOSITORY,
  CartRepository,
} from '../../domain/repositories/cart.repository';
import { CartItem } from '../../domain/entities/cart-item.entity';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly repository: CartRepository,
  ) {}

  async execute(customerId: number): Promise<{
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
  }> {
    const items = await this.repository.findByCustomerId(customerId);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price ?? 0),
      0,
    );
    return { items, totalItems, totalAmount };
  }
}
