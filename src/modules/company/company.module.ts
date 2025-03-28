import { CompanyController } from './controllers/company.controller';
import { CompanyService } from './services/company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { LoggerService } from 'src/common/decorators/logger.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity])],
  controllers: [CompanyController],
  providers: [CompanyService, LoggerService],
})
export class CompanyModule { }
