import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { CartItem } from '../../domain/entities/cart-item.entity';
import { CartItem as PrismaCartItem, Product } from '@prisma/client';

type CartItemWithProduct = PrismaCartItem & { product: Product };

@Injectable()
export class PrismaCartRepository implements CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCustomerId(customerId: number): Promise<CartItem[]> {
    const items = await this.prisma.cartItem.findMany({
      where: { customerId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((item) => this.toDomain(item));
  }

  async findItem(
    customerId: number,
    productId: number,
  ): Promise<CartItem | null> {
    const item = await this.prisma.cartItem.findUnique({
      where: { customerId_productId: { customerId, productId } },
      include: { product: true },
    });
    return item ? this.toDomain(item) : null;
  }

  async addItem(
    customerId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItem> {
    const item = await this.prisma.cartItem.upsert({
      where: { customerId_productId: { customerId, productId } },
      update: { quantity: { increment: quantity } },
      create: { customerId, productId, quantity },
      include: { product: true },
    });
    return this.toDomain(item);
  }

  async updateItemQuantity(
    customerId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItem> {
    const item = await this.prisma.cartItem.update({
      where: { customerId_productId: { customerId, productId } },
      data: { quantity },
      include: { product: true },
    });
    return this.toDomain(item);
  }

  async removeItem(customerId: number, productId: number): Promise<void> {
    await this.prisma.cartItem.delete({
      where: { customerId_productId: { customerId, productId } },
    });
  }

  async clearCart(customerId: number): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { customerId },
    });
  }

  private toDomain(item: CartItemWithProduct): CartItem {
    return new CartItem(
      item.id,
      item.customerId,
      item.productId,
      item.quantity,
      item.createdAt,
      item.updatedAt,
      item.product
        ? {
            name: item.product.name,
            price: item.product.price,
            image: item.product.image ?? null,
            stock: item.product.stock,
            isAvailable: item.product.isAvailable,
          }
        : null,
    );
  }
}
