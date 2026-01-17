import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { Category } from '../../domain/entities/category.entity';
import { Category as PrismaCategory } from '@prisma/client';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Category>): Promise<Category | null> {
    const created = await this.prisma.category.create({
      data: {
        name: data.name ?? '',
      },
    });

    return this.toDomain(created);
  }

  async findOne(data: Partial<Category>): Promise<Category | null> {
    if (!data.id) {
      return null;
    }

    const found = await this.prisma.category.findUnique({
      where: { id: data.id },
    });

    return found ? this.toDomain(found) : null;
  }

  async findAll(filters: { search?: string; skip?: number; take?: number }): Promise<Category[] | null> {
    const items = await this.prisma.category.findMany({
      where: {
        name: filters.search
          ? {
              contains: filters.search,
            }
          : undefined,
      },
      orderBy: { createdAt: 'desc' },
      skip: filters.skip,
      take: filters.take,
    });

    return items.map((item) => this.toDomain(item));
  }

  async update(id: number, data: Partial<Category>): Promise<Category | null> {
    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: number): Promise<{ message: string; entity: Category | null }> {
    const deleted = await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: 'Category deleted successfully',
      entity: this.toDomain(deleted),
    };
  }

  private toDomain(category: PrismaCategory): Category {
    return new Category(category.id, category.name, category.createdAt, category.updatedAt ?? null);
  }
}
