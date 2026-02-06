import { Inject, Injectable } from '@nestjs/common';
import {
  CART_REPOSITORY,
  CartRepository,
} from '../../domain/repositories/cart.repository';

@Injectable()
export class ClearCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly repository: CartRepository,
  ) {}

  async execute(customerId: number): Promise<{ message: string }> {
    await this.repository.clearCart(customerId);
    return { message: 'Cart cleared' };
  }
}
