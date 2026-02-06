import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../domain/repositories/order.repository';
import {
  CART_REPOSITORY,
  CartRepository,
} from '../../../cart/domain/repositories/cart.repository';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../../products/domain/repositories/product.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../../domain/entities/order.entity';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(customerId: number, dto: CreateOrderDto): Promise<Order> {
    const cartItems = await this.cartRepository.findByCustomerId(customerId);
    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderItems: {
      productId: number;
      quantity: number;
      unitPrice: number;
      productName: string;
    }[] = [];

    for (const cartItem of cartItems) {
      const product = await this.productRepository.findOne({
        id: cartItem.productId,
      });
      if (!product || product.deletedAt || !product.isAvailable) {
        throw new BadRequestException(
          `Product "${cartItem.product?.name ?? cartItem.productId}" is no longer available`,
        );
      }
      if (cartItem.quantity > product.stock) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, In cart: ${cartItem.quantity}`,
        );
      }

      orderItems.push({
        productId: product.id,
        quantity: cartItem.quantity,
        unitPrice: product.price,
        productName: product.name,
      });
    }

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    return this.orderRepository.create({
      customerId,
      shippingAddress: dto.shippingAddress,
      notes: dto.notes ?? null,
      items: orderItems,
      totalAmount,
    });
  }
}
