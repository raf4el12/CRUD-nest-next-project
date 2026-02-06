import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../auth/interfaces/guards/jwt-auth.guard';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../users/domain/repositories/user.repository';
import { GetCartUseCase } from '../../application/use-cases/get-cart.use-case';
import { AddCartItemUseCase } from '../../application/use-cases/add-cart-item.use-case';
import { UpdateCartItemUseCase } from '../../application/use-cases/update-cart-item.use-case';
import { RemoveCartItemUseCase } from '../../application/use-cases/remove-cart-item.use-case';
import { ClearCartUseCase } from '../../application/use-cases/clear-cart.use-case';
import { AddCartItemDto } from '../../application/dto/add-cart-item.dto';
import { UpdateCartItemDto } from '../../application/dto/update-cart-item.dto';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly getCart: GetCartUseCase,
    private readonly addCartItem: AddCartItemUseCase,
    private readonly updateCartItem: UpdateCartItemUseCase,
    private readonly removeCartItem: RemoveCartItemUseCase,
    private readonly clearCart: ClearCartUseCase,
  ) {}

  private async getCustomerId(req: Request): Promise<number> {
    const user = (req as any).user;
    const customer = await this.userRepository.findCustomerByUserId(user.sub);
    if (!customer) {
      throw new UnauthorizedException('Customer profile not found');
    }
    return customer.id;
  }

  @Get()
  async findAll(@Req() req: Request) {
    const customerId = await this.getCustomerId(req);
    return this.getCart.execute(customerId);
  }

  @Post('items')
  async addItem(@Req() req: Request, @Body() dto: AddCartItemDto) {
    const customerId = await this.getCustomerId(req);
    return this.addCartItem.execute(customerId, dto);
  }

  @Patch('items/:productId')
  async updateItem(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    const customerId = await this.getCustomerId(req);
    return this.updateCartItem.execute(customerId, productId, dto);
  }

  @Delete('items/:productId')
  async removeItem(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const customerId = await this.getCustomerId(req);
    return this.removeCartItem.execute(customerId, productId);
  }

  @Delete()
  async clear(@Req() req: Request) {
    const customerId = await this.getCustomerId(req);
    return this.clearCart.execute(customerId);
  }
}
