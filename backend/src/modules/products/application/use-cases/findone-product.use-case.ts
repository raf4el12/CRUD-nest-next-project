import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class FindOneProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository,
  ) {}

  async execute(id: number): Promise<Product | null> {
    const product = await this.repository.findOne({ id });
    if (!product || product.deletedAt) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
