import { CartItem } from '../entities/cart-item.entity';

export const CART_REPOSITORY = 'CartRepository';

export interface CartRepository {
  findByCustomerId(customerId: number): Promise<CartItem[]>;
  findItem(customerId: number, productId: number): Promise<CartItem | null>;
  addItem(
    customerId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItem>;
  updateItemQuantity(
    customerId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItem>;
  removeItem(customerId: number, productId: number): Promise<void>;
  clearCart(customerId: number): Promise<void>;
}
