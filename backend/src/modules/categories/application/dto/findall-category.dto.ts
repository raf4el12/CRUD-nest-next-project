import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterCategoryDto } from './filter-category.dto';

export class FindAllCategoryDto extends FilterCategoryDto {
  @ApiPropertyOptional({ example: 0, description: 'Offset para paginación' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional({ example: 20, description: 'Límite de registros' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  take?: number;
}
