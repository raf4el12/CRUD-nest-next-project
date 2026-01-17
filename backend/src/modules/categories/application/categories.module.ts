import { Module } from '@nestjs/common';
import { CategoryController } from '../interfaces/controllers/category.controller';
import { CreateCategoryUseCase } from './use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from './use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './use-cases/delete-category.use-case';
import { FindOneCategoryUseCase } from './use-cases/findone-category.use-case';
import { FindAllCategoryUseCase } from './use-cases/findall-category.use-case';
import { PrismaCategoryRepository } from '../infraestructure/persistence/prisma-category.repository';
import { CATEGORY_REPOSITORY } from '../domain/repositories/category.repository';

@Module({
  controllers: [CategoryController],
  providers: [
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    FindOneCategoryUseCase,
    FindAllCategoryUseCase,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [CreateCategoryUseCase, FindAllCategoryUseCase],
})
export class CategoriesModule {}
