import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';
import { CreateSubcategoryDto } from '../dto/subcategory.dto';
import { SubcategoryService } from '../services/subcategory.service';
import { SubcategoryMessage } from '../enums/subcategory-message.enum';
import { SubcategoryEntity } from '../entities/subcategory.entity';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes';

@ApiTags('Subcategories')
@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new subcategory' })
  @ApiResponse({ status: 201, description: SubcategoryMessage.CREATED, type: SubcategoryEntity })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() dto: CreateSubcategoryDto) {
    return this.subcategoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subcategories' })
  @ApiResponse({ status: 200, description: SubcategoryMessage.RETRIEVED_ALL, type: [SubcategoryEntity] })
  findAll() {
    return this.subcategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subcategory by ID' })
  @ApiResponse({ status: 200, description: SubcategoryMessage.RETRIEVED_ONE, type: SubcategoryEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subcategoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a subcategory' })
  @ApiResponse({ status: 200, description: SubcategoryMessage.UPDATED, type: SubcategoryEntity })
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubcategoryDto) {
    return this.subcategoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subcategory' })
  @ApiResponse({ status: 200, description: SubcategoryMessage.DELETED })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subcategoryService.remove(id);
  }
}
