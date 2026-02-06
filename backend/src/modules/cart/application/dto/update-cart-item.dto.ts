import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartItemDto {
  @ApiProperty({ example: 2, description: 'Nueva cantidad' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
