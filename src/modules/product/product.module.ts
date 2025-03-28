import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
