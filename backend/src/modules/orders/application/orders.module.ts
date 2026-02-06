import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/application/auth.module';
import { UsersModule } from '../../users/application/users.module';
import { OrderController } from '../interfaces/controllers/order.controller';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { FindOneOrderUseCase } from './use-cases/findone-order.use-case';
import { FindMyOrdersUseCase } from './use-cases/find-my-orders.use-case';
import { FindAllOrderPaginationUseCase } from './use-cases/findall-order-pagination.use-case';
import { UpdateOrderStatusUseCase } from './use-cases/update-order-status.use-case';
import { CancelOrderUseCase } from './use-cases/cancel-order.use-case';
import { PrismaOrderRepository } from '../infraestructure/persistence/prisma-order.repository';
import { ORDER_REPOSITORY } from '../domain/repositories/order.repository';
import { CART_REPOSITORY } from '../../cart/domain/repositories/cart.repository';
import { PrismaCartRepository } from '../../cart/infraestructure/persistence/prisma-cart.repository';
import { PRODUCT_REPOSITORY } from '../../products/domain/repositories/product.repository';
import { PrismaProductRepository } from '../../products/infraestructure/persistence/prisma-product.repository';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    FindOneOrderUseCase,
    FindMyOrdersUseCase,
    FindAllOrderPaginationUseCase,
    UpdateOrderStatusUseCase,
    CancelOrderUseCase,
    {
      provide: ORDER_REPOSITORY,
      useClass: PrismaOrderRepository,
    },
    {
      provide: CART_REPOSITORY,
      useClass: PrismaCartRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
  ],
})
export class OrdersModule {}
