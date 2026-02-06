import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationOrderDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Pagina actual',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  currentPage?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad por pagina',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Campo de ordenamiento',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Modo de ordenamiento',
  })
  @IsOptional()
  @IsString()
  orderByMode?: string;

  @ApiPropertyOptional({
    example: 'PENDING',
    description: 'Filtrar por estado',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
