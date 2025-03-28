import { SubcategoryController } from './controllers/subcategory.controller';
import { SubcategoryService } from './services/subcategory.service';
import { SubcategoryEntity } from './entities/subcategory.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { LoggerService } from 'src/common/decorators/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([SubcategoryEntity, CategoryEntity])],
  controllers: [SubcategoryController],
  providers: [SubcategoryService, LoggerService],
  exports: [SubcategoryService],
})
export class SubcategoryModule { }
