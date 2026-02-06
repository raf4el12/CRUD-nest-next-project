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
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CartItem } from '../../domain/entities/cart-item.entity';

@Injectable()
export class UpdateCartItemUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    customerId: number,
    productId: number,
    dto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const existingItem = await this.cartRepository.findItem(
      customerId,
      productId,
    );
    if (!existingItem) {
      throw new NotFoundException('Item not found in cart');
    }

    const product = await this.productRepository.findOne({ id: productId });
    if (!product || product.deletedAt) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (dto.quantity > product.stock) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}, Requested: ${dto.quantity}`,
      );
    }

    return this.cartRepository.updateItemQuantity(
      customerId,
      productId,
      dto.quantity,
    );
  }
}
