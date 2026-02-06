import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../auth/interfaces/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/interfaces/guards/roles.guard';
import { Roles } from '../../../auth/interfaces/decorators/roles.decorator';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../users/domain/repositories/user.repository';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { FindOneOrderUseCase } from '../../application/use-cases/findone-order.use-case';
import { FindMyOrdersUseCase } from '../../application/use-cases/find-my-orders.use-case';
import { FindAllOrderPaginationUseCase } from '../../application/use-cases/findall-order-pagination.use-case';
import { UpdateOrderStatusUseCase } from '../../application/use-cases/update-order-status.use-case';
import { CancelOrderUseCase } from '../../application/use-cases/cancel-order.use-case';
import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { UpdateOrderStatusDto } from '../../application/dto/update-order-status.dto';
import { PaginationOrderDto } from '../../application/dto/pagination-order.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly createOrder: CreateOrderUseCase,
    private readonly findOneOrder: FindOneOrderUseCase,
    private readonly findMyOrders: FindMyOrdersUseCase,
    private readonly findAllOrderPagination: FindAllOrderPaginationUseCase,
    private readonly updateOrderStatus: UpdateOrderStatusUseCase,
    private readonly cancelOrder: CancelOrderUseCase,
  ) {}

  private async getCustomerId(req: Request): Promise<number> {
    const user = (req as any).user;
    const customer = await this.userRepository.findCustomerByUserId(user.sub);
    if (!customer) {
      throw new UnauthorizedException('Customer profile not found');
    }
    return customer.id;
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateOrderDto) {
    const customerId = await this.getCustomerId(req);
    return this.createOrder.execute(customerId, dto);
  }

  @Get('my')
  async findMy(
    @Req() req: Request,
    @Query() queryPagination: PaginationOrderDto,
  ) {
    const customerId = await this.getCustomerId(req);
    return this.findMyOrders.execute(customerId, queryPagination);
  }

  @Get('pagination')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAllPagination(@Query() queryPagination: PaginationOrderDto) {
    return this.findAllOrderPagination.execute(queryPagination);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const customerId = await this.getCustomerId(req);
    return this.findOneOrder.execute(id, customerId, user.role);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.updateOrderStatus.execute(id, dto);
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const customerId = await this.getCustomerId(req);
    return this.cancelOrder.execute(id, customerId);
  }
}
