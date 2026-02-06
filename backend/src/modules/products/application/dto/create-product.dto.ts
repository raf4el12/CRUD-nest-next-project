import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Lenovo', description: 'Nombre del producto' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Laptop para trabajo',
    description: 'Descripción',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1999.99, description: 'Precio del producto' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 'https://img.url/1.png',
    description: 'Imagen',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: true, description: 'Disponible' })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: 100, description: 'Stock disponible' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID de categoría' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
