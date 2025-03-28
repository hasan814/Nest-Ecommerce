import { SubcategoryController } from './controllers/subcategory.controller';
import { SubcategoryService } from './services/subcategory.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
})
export class SubcategoryModule { }
