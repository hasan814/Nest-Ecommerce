import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CategoryEntity } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../redis/redis.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    RedisModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule { }
