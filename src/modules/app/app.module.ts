import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { Module } from '@nestjs/common';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), CompanyModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
