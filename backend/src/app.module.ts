import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/application/products.module';
import { CategoriesModule } from './modules/categories/application/categories.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductsModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
