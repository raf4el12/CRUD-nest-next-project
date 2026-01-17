import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { Category } from '../../domain/entities/category.entity';
import { Category as PrismaCategory, Prisma } from '@prisma/client';
import { Pagination } from '../../../../shared/utils/value-objects/pagination.value-object';
import pagination from '../../../../shared/utils/pagination';

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

  async findAllPagination(queryPagination: Pagination): Promise<any> {
    const { searchValue, currentPage, pageSize, orderBy, orderByMode } = queryPagination;
    const dynamicOrderBy = { [orderBy || 'createdAt']: orderByMode || 'desc' };
    const { limit, offset } = pagination.getPagination(currentPage, pageSize);

    const query: Prisma.CategoryFindManyArgs = {
      where: {
        name: searchValue
          ? {
              contains: searchValue,
            }
          : undefined,
      },
      orderBy: [dynamicOrderBy],
      take: limit,
      skip: offset,
    };

    const [items, count] = await this.prisma.$transaction([
      this.prisma.category.findMany(query),
      this.prisma.category.count({ where: query.where }),
    ]);

    const dataResponse = {
      rows: items.map((item) => this.toDomain(item)),
      count,
    };

    return pagination.getDataPagination(dataResponse, currentPage, limit);
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
