import { ProductController } from './controllers/product.controller';
import { SubcategoryEntity } from '../subcategory/entities/subcategory.entity';
import { ProductService } from './services/product.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from 'src/common/decorators/logger.service';
import { ProductEntity } from './entities/product.entity';
import { RedisModule } from '../redis/redis.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      CategoryEntity,
      SubcategoryEntity,
    ]),
    RedisModule
  ],
  controllers: [ProductController],
  providers: [ProductService, LoggerService],
})
export class ProductModule { }
