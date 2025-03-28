import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyMessage } from '../enums/messages.enum';
import { LoggerService } from 'src/common/decorators/logger.service';
import { CompanyEntity } from '../entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
    private logger: LoggerService,
  ) { }

  async create(data: CreateCompanyDto): Promise<{ message: string; data: CompanyEntity }> {
    const company = this.companyRepository.create(data);
    const savedCompany = await this.companyRepository.save(company);
    this.logger.log(`Company created: ${savedCompany.name}`);
    return {
      message: CompanyMessage.CREATED,
      data: savedCompany,
    };
  }

  async findAll(): Promise<{ message: string; data: CompanyEntity[] }> {
    const companies = await this.companyRepository.find({ relations: ['product'] });
    this.logger.log('Fetched all companies');
    return {
      message: CompanyMessage.RETRIEVED_ALL,
      data: companies,
    };
  }

  async findOne(id: number): Promise<{ message: string; data: CompanyEntity }> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!company) {
      this.logger.error(`Company with id ${id} not found`);
      throw new NotFoundException(CompanyMessage.NOT_FOUND);
    }
    this.logger.log(`Fetched company with id ${id}`);
    return {
      message: CompanyMessage.RETRIEVED_ONE,
      data: company,
    };
  }

  async update(id: number, updateData: UpdateCompanyDto): Promise<{ message: string; data: CompanyEntity }> {
    const existing = await this.companyRepository.findOneBy({ id });
    if (!existing) {
      this.logger.error(`Company with id ${id} not found for update`);
      throw new NotFoundException(CompanyMessage.NOT_FOUND);
    }
    const updatedCompany = await this.companyRepository.save({ ...existing, ...updateData });
    this.logger.log(`Company updated: ${updatedCompany.name}`);
    return {
      message: CompanyMessage.UPDATED,
      data: updatedCompany,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      this.logger.error(`Company with id ${id} not found for deletion`);
      throw new NotFoundException(CompanyMessage.NOT_FOUND);
    }
    this.logger.log(`Company deleted with id ${id}`);
    return {
      message: CompanyMessage.DELETED,
    };
  }
}
