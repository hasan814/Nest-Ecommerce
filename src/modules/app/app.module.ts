import { SubcategoryModule } from '../subcategory/subcategory.module';
import { CategoryModule } from '../category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { CompanyModule } from '../company/company.module';
import { ProductModule } from '../product/product.module';
import { LoggerService } from '../../common/decorators/logger.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    CompanyModule,
    ProductModule,
    CategoryModule,
    SubcategoryModule
  ],
  controllers: [],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class AppModule { }
