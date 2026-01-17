import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY, CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repository: CategoryRepository,
  ) {}

  async execute(id: number) {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.repository.delete(id);
  }
}
