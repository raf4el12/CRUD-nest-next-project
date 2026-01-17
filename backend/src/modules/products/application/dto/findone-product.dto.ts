import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindOneProductDto {
  @ApiProperty({ example: 1, description: 'ID del producto' })
  @Type(() => Number)
  @IsNumber()
  id: number;
}
