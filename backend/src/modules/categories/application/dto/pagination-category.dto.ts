import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationCategoryDto {
  @ApiPropertyOptional({
    example: 'elec',
    description: 'Texto de búsqueda por nombre de categoría',
  })
  @IsOptional()
  @IsString()
  searchValue?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Número de la página actual para la paginación',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  currentPage?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad de resultados por página',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Campo por el cual se quiere ordenar la búsqueda',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Modo de ordenamiento (asc o desc)',
  })
  @IsOptional()
  @IsString()
  orderByMode?: string;
}
