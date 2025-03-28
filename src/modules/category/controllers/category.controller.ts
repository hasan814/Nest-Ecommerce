import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryDto } from '../dto/category.dto';
import { CategoryService } from '../services/category.service';
import { CategoryMessage } from '../enums/category-message.enum';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes';
import { CategoryEntity } from '../entities/category.entity';

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: CategoryMessage.CREATED, type: CategoryEntity })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: CategoryMessage.RETRIEVED_ALL, type: [CategoryEntity] })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID including products & subcategories' })
  @ApiResponse({ status: 200, description: CategoryMessage.RETRIEVED_ONE, type: CategoryEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: CategoryMessage.UPDATED, type: CategoryEntity })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: CategoryMessage.DELETED })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
