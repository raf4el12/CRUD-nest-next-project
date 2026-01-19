import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-category.use-case';
import { FindOneCategoryUseCase } from '../../application/use-cases/findone-category.use-case';
import { FindAllCategoryPaginationUseCase } from '../../application/use-cases/findall-category-pagination.use-case';
import { CreateCategoryDto } from '../../application/dto/create-category.dto';
import { UpdateCategoryDto } from '../../application/dto/update-category.dto';
import { PaginationCategoryDto } from '../../application/dto/pagination-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategory: CreateCategoryUseCase,
    private readonly updateCategory: UpdateCategoryUseCase,
    private readonly deleteCategory: DeleteCategoryUseCase,
    private readonly findOneCategory: FindOneCategoryUseCase,
    private readonly findAllCategoryPagination: FindAllCategoryPaginationUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.createCategory.execute(dto);
  }

  @Get('pagination')
  findAllPagination(@Query() queryPagination: PaginationCategoryDto) {
    return this.findAllCategoryPagination.execute(queryPagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneCategory.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.updateCategory.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteCategory.execute(id);
  }
}
