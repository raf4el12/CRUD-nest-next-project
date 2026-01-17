import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterProductDto } from './filter-product.dto';

export class FindAllProductDto extends FilterProductDto {
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
