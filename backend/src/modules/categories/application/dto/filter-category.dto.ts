import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterCategoryDto {
  @ApiPropertyOptional({ example: 'elec', description: 'Texto de búsqueda' })
  @IsString()
  @IsOptional()
  search?: string;
}
