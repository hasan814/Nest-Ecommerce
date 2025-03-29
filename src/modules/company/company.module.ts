import { CompanyController } from './controllers/company.controller';
import { CompanyService } from './services/company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { LoggerService } from 'src/common/decorators/logger.service';
import { RedisModule } from '../redis/redis.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), RedisModule],
  controllers: [CompanyController],
  providers: [CompanyService, LoggerService],
})
export class CompanyModule { }
