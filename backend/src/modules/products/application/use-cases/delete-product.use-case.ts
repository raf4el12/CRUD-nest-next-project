import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository,
  ) {}

  async execute(id: number) {
    const found = await this.repository.findOne({ id });
    if (!found || found.deletedAt) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.repository.softDelete(id);
  }
}
