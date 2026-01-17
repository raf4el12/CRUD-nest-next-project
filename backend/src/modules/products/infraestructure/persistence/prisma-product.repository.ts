import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { Product as PrismaProduct } from '@prisma/client';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Product>): Promise<Product | null> {
    const created = await this.prisma.product.create({
      data: {
        name: data.name ?? '',
        description: data.description ?? null,
        price: data.price ?? 0,
        image: data.image ?? null,
        isAvailable: data.isAvailable ?? true,
        categoryId: data.categoryId ?? null,
      },
    });

    return this.toDomain(created);
  }

  async findOne(data: Partial<Product>): Promise<Product | null> {
    if (!data.id) {
      return null;
    }

    const found = await this.prisma.product.findUnique({
      where: { id: data.id },
    });

    return found ? this.toDomain(found) : null;
  }

  async findAll(filters: {
    search?: string;
    categoryId?: number;
    isAvailable?: boolean;
    minPrice?: number;
    maxPrice?: number;
    skip?: number;
    take?: number;
  }): Promise<Product[] | null> {
    const items = await this.prisma.product.findMany({
      where: {
        deletedAt: null,
        isAvailable: filters.isAvailable ?? undefined,
        categoryId: filters.categoryId ?? undefined,
        name: filters.search
          ? {
              contains: filters.search,
            }
          : undefined,
        price: {
          gte: filters.minPrice ?? undefined,
          lte: filters.maxPrice ?? undefined,
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: filters.skip,
      take: filters.take,
    });

    return items.map((item) => this.toDomain(item));
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        price: data.price ?? undefined,
        image: data.image ?? undefined,
        isAvailable: data.isAvailable ?? undefined,
        categoryId: data.categoryId ?? undefined,
      },
    });

    return this.toDomain(updated);
  }

  async softDelete(id: number): Promise<{ message: string; entity: Product | null }> {
    const deleted = await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isAvailable: false },
    });

    return {
      message: 'Product deleted successfully',
      entity: this.toDomain(deleted),
    };
  }

  private toDomain(product: PrismaProduct): Product {
    return new Product(
      product.id,
      product.name,
      product.description ?? null,
      product.price,
      product.image ?? null,
      product.isAvailable,
      product.deletedAt ?? null,
      product.categoryId ?? null,
      product.createdAt,
      product.updatedAt ?? null,
    );
  }
}
