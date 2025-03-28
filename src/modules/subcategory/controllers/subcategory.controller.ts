import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateSubcategoryDto } from '../dto/subcategory.dto';
import { SubcategoryService } from '../services/subcategory.service';


@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) { }

  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.create(createSubcategoryDto);
  }

  @Get()
  findAll() {
    return this.subcategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoryService.findOne(+id);
  }

}
