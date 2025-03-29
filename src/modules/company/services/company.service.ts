import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyMessage } from '../enums/messages.enum';
import { CompanyEntity } from '../entities/company.entity';
import { LoggerService } from 'src/common/decorators/logger.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
    private redisService: RedisService,
    private logger: LoggerService,
  ) { }

  async create(dto: CreateCompanyDto) {
    const company = this.companyRepository.create(dto);
    const saved = await this.companyRepository.save(company);
    await this.redisService.del('companies');
    this.logger.log(`Company created: ${saved.name}`);
    return { message: CompanyMessage.CREATED, data: saved };
  }

  async findAll() {
    const companies = await this.companyRepository.find();
    this.logger.log('Returned companies from DB');
    return { message: CompanyMessage.RETRIEVED_ALL, data: companies };
  }

  async findOne(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id },
    });
    if (!company) {
      this.logger.error(`Company with id ${id} not found`);
      throw new NotFoundException(CompanyMessage.NOT_FOUND);
    }
    this.logger.log(`Returned company ${id} from DB`);
    return { message: CompanyMessage.RETRIEVED_ONE, data: company };
  }


  async update(id: number, dto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) {
      this.logger.error(`Company with id ${id} not found for update`);
      throw new NotFoundException(CompanyMessage.NOT_FOUND);
    }
    Object.assign(company, dto);
    const updated = await this.companyRepository.save(company);
    await this.redisService.del(`company:${id}`);
    await this.redisService.del('companies');
    this.logger.log(`Company updated: ${updated.name}`);
    return { message: CompanyMessage.UPDATED, data: updated };
  }

  async remove(id: number) {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      this.logger.error(`Company with id ${id} not found for deletion`);
      throw new NotFoundException(CompanyMessage.NOT_FOUND);
    }
    await this.redisService.del(`company:${id}`);
    await this.redisService.del('companies');
    this.logger.log(`Company deleted with id ${id}`);
    return { message: CompanyMessage.DELETED };
  }
}
