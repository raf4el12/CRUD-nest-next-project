import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/application/products.module';
import { CategoriesModule } from './modules/categories/application/categories.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/application/users.module';
import { AuthModule } from './modules/auth/application/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ProductsModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
