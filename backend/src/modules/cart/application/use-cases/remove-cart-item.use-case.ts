import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CART_REPOSITORY,
  CartRepository,
} from '../../domain/repositories/cart.repository';

@Injectable()
export class RemoveCartItemUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly repository: CartRepository,
  ) {}

  async execute(
    customerId: number,
    productId: number,
  ): Promise<{ message: string }> {
    const item = await this.repository.findItem(customerId, productId);
    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }
    await this.repository.removeItem(customerId, productId);
    return { message: 'Item removed from cart' };
  }
}
