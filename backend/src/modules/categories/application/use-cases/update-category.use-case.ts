import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../domain/repositories/category.repository';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../../domain/entities/category.entity';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repository: CategoryRepository,
  ) {}

  async execute(id: number, dto: UpdateCategoryDto): Promise<Category | null> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.repository.update(id, { name: dto.name ?? undefined });
  }
}
