import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../domain/repositories/product.repository';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository,
  ) {}

  async execute(id: number, dto: UpdateProductDto): Promise<Product | null> {
    const found = await this.repository.findOne({ id });
    if (!found || found.deletedAt) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.repository.update(id, {
      name: dto.name ?? undefined,
      description: dto.description ?? undefined,
      price: dto.price ?? undefined,
      image: dto.image ?? undefined,
      isAvailable: dto.isAvailable ?? undefined,
      categoryId: dto.categoryId ?? undefined,
    });
  }
}
