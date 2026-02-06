import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'Av. Principal 123, Lima',
    description: 'Direccion de envio',
  })
  @IsString()
  shippingAddress: string;

  @ApiPropertyOptional({
    example: 'Entregar en puerta',
    description: 'Notas adicionales',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
