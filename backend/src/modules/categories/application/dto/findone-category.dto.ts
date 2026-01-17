import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindOneCategoryDto {
  @ApiProperty({ example: 1, description: 'ID de la categoría' })
  @Type(() => Number)
  @IsNumber()
  id: number;
}
