import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { CompanyModule } from '../company/company.module';
import { ProductModule } from '../product/product.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), CompanyModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
