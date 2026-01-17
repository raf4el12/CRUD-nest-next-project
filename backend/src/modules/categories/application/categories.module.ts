import { Module } from '@nestjs/common';
import { CategoryController } from '../interfaces/controllers/category.controller';
import { CreateCategoryUseCase } from './use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from './use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './use-cases/delete-category.use-case';
import { FindOneCategoryUseCase } from './use-cases/findone-category.use-case';
import { FindAllCategoryPaginationUseCase } from './use-cases/findall-category-pagination.use-case';
import { PrismaCategoryRepository } from '../infraestructure/persistence/prisma-category.repository';
import { CATEGORY_REPOSITORY } from '../domain/repositories/category.repository';

@Module({
  controllers: [CategoryController],
  providers: [
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    FindOneCategoryUseCase,
    FindAllCategoryPaginationUseCase,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [CreateCategoryUseCase, FindAllCategoryPaginationUseCase],
})
export class CategoriesModule {}
