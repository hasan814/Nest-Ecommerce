import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { Module } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { SubcategoryEntity } from '../subcategory/entities/subcategory.entity';
import { CategoryEntity } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, SubcategoryEntity, CategoryEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
