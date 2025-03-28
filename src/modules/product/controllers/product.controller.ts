import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateProductDto } from '../dto/product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductMessage } from '../enums/product-message.enum';
import { ProductService } from '../services/product.service';
import { ProductSummary } from '../enums/product-summary.enum';
import { ProductEntity } from '../entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiOperation({ summary: ProductSummary.CREATE })
  @ApiResponse({ status: 201, description: ProductMessage.CREATED, type: ProductEntity })
  create(@Body() createDto: CreateProductDto) {
    return this.productService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: ProductSummary.GET_ALL })
  @ApiResponse({ status: 200, description: ProductMessage.RETRIEVED_ALL, type: [ProductEntity] })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: ProductSummary.GET_ONE })
  @ApiResponse({ status: 200, description: ProductMessage.RETRIEVED_ONE, type: ProductEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: ProductSummary.UPDATE })
  @ApiResponse({ status: 200, description: ProductMessage.UPDATED, type: ProductEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateProductDto) {
    return this.productService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: ProductSummary.DELETE })
  @ApiResponse({ status: 200, description: ProductMessage.DELETED })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  @Get('barcode/:barcode')
  @ApiOperation({ summary: ProductSummary.SEARCH_BARCODE })
  @ApiResponse({ status: 200, description: ProductMessage.RETRIEVED_ONE, type: ProductEntity })
  findByBarcode(@Param('barcode') barcode: string) {
    return this.productService.findByBarcode(barcode);
  }
}
