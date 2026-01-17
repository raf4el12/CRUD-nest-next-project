import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../domain/repositories/product.repository';
import { FindAllProductDto } from '../dto/findall-product.dto';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class FindAllProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository,
  ) {}

  execute(filters: FindAllProductDto): Promise<Product[] | null> {
    return this.repository.findAll({
      search: filters.search,
      categoryId: filters.categoryId,
      isAvailable: filters.isAvailable,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      skip: filters.skip,
      take: filters.take,
    });
  }
}
