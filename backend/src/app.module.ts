import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/application/products.module';
import { CategoriesModule } from './modules/categories/application/categories.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/application/users.module';
import { AuthModule } from './modules/auth/application/auth.module';
import { CartModule } from './modules/cart/application/cart.module';
import { OrdersModule } from './modules/orders/application/orders.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
