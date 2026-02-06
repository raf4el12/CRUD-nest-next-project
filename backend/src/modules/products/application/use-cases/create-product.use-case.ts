import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../domain/repositories/product.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository,
  ) {}

  execute(dto: CreateProductDto): Promise<Product | null> {
    return this.repository.create({
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      image: dto.image ?? null,
      isAvailable: dto.isAvailable ?? true,
      stock: dto.stock ?? 0,
      categoryId: dto.categoryId ?? null,
    });
  }
}
