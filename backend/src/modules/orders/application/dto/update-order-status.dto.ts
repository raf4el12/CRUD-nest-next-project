import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatusEnum,
    example: 'CONFIRMED',
    description: 'Nuevo estado del pedido',
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;
}
