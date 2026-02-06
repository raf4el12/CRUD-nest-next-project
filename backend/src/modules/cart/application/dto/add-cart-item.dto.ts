import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddCartItemDto {
  @ApiProperty({ example: 1, description: 'ID del producto' })
  @Type(() => Number)
  @IsInt()
  productId: number;

  @ApiPropertyOptional({ example: 1, description: 'Cantidad', default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
