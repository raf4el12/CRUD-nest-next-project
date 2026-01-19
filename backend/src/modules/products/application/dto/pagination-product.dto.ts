import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationProductDto {
  @ApiPropertyOptional({
    example: 'laptop',
    description: 'Texto de búsqueda por nombre o descripción del producto',
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

  @ApiPropertyOptional({ example: 1, description: 'ID de categoría' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({ example: true, description: 'Disponible' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: 100, description: 'Precio mínimo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 5000, description: 'Precio máximo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
