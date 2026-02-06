import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/application/auth.module';
import { UsersModule } from '../../users/application/users.module';
import { CartController } from '../interfaces/controllers/cart.controller';
import { GetCartUseCase } from './use-cases/get-cart.use-case';
import { AddCartItemUseCase } from './use-cases/add-cart-item.use-case';
import { UpdateCartItemUseCase } from './use-cases/update-cart-item.use-case';
import { RemoveCartItemUseCase } from './use-cases/remove-cart-item.use-case';
import { ClearCartUseCase } from './use-cases/clear-cart.use-case';
import { PrismaCartRepository } from '../infraestructure/persistence/prisma-cart.repository';
import { CART_REPOSITORY } from '../domain/repositories/cart.repository';
import { PRODUCT_REPOSITORY } from '../../products/domain/repositories/product.repository';
import { PrismaProductRepository } from '../../products/infraestructure/persistence/prisma-product.repository';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [CartController],
  providers: [
    GetCartUseCase,
    AddCartItemUseCase,
    UpdateCartItemUseCase,
    RemoveCartItemUseCase,
    ClearCartUseCase,
    {
      provide: CART_REPOSITORY,
      useClass: PrismaCartRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [CART_REPOSITORY],
})
export class CartModule {}
