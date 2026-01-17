import { Module } from '@nestjs/common';
import { ProductController } from '../interfaces/controllers/product.controller';
import { CreateProductUseCase } from './use-cases/create-product.use-case';
import { UpdateProductUseCase } from './use-cases/update-product.use-case';
import { DeleteProductUseCase } from './use-cases/delete-product.use-case';
import { FindOneProductUseCase } from './use-cases/findone-product.use-case';
import { FindAllProductUseCase } from './use-cases/findall-product.use-case';
import { PrismaProductRepository } from '../infraestructure/persistence/prisma-product.repository';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository';

@Module({
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    FindOneProductUseCase,
    FindAllProductUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [CreateProductUseCase, FindAllProductUseCase],
})
export class ProductsModule {}
