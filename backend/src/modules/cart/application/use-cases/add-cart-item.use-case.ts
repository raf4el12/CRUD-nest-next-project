import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CART_REPOSITORY,
  CartRepository,
} from '../../domain/repositories/cart.repository';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../../products/domain/repositories/product.repository';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { CartItem } from '../../domain/entities/cart-item.entity';

@Injectable()
export class AddCartItemUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(customerId: number, dto: AddCartItemDto): Promise<CartItem> {
    const product = await this.productRepository.findOne({
      id: dto.productId,
    });
    if (!product || product.deletedAt) {
      throw new NotFoundException(
        `Product with ID ${dto.productId} not found`,
      );
    }
    if (!product.isAvailable) {
      throw new BadRequestException('Product is not available');
    }

    const quantity = dto.quantity ?? 1;

    const existingItem = await this.cartRepository.findItem(
      customerId,
      dto.productId,
    );
    const totalQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (totalQuantity > product.stock) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}, Requested total: ${totalQuantity}`,
      );
    }

    return this.cartRepository.addItem(customerId, dto.productId, quantity);
  }
}
