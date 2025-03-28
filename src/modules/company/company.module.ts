import { CompanyController } from './controllers/company.controller';
import { CompanyService } from './services/company.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule { }
