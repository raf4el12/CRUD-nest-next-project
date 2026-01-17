import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { FindOneProductUseCase } from '../../application/use-cases/findone-product.use-case';
import { FindAllProductUseCase } from '../../application/use-cases/findall-product.use-case';
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { UpdateProductDto } from '../../application/dto/update-product.dto';
import { FindAllProductDto } from '../../application/dto/findall-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
    private readonly findOneProduct: FindOneProductUseCase,
    private readonly findAllProduct: FindAllProductUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createProduct.execute(dto);
  }

  @Get()
  findAll(@Query() filters: FindAllProductDto) {
    return this.findAllProduct.execute(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneProduct.execute(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.updateProduct.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteProduct.execute(id);
  }
}
