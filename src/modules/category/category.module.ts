import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule { }
