import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyMessage } from '../enums/messages.enum';
import { CompanyEntity } from '../entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) { }

  async create(data: CreateCompanyDto): Promise<{ message: string; data: CompanyEntity }> {
    const company = this.companyRepository.create(data);
    const savedCompany = await this.companyRepository.save(company);
    return {
      message: CompanyMessage.CREATED,
      data: savedCompany,
    };
  }

  async findAll(): Promise<{ message: string; data: CompanyEntity[] }> {
    const companies = await this.companyRepository.find({ relations: ['product'] });
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
    if (!company) throw new NotFoundException(CompanyMessage.NOT_FOUND);
    return {
      message: CompanyMessage.RETRIEVED_ONE,
      data: company,
    };
  }

  async update(id: number, updateData: UpdateCompanyDto): Promise<{ message: string; data: CompanyEntity }> {
    const existing = await this.companyRepository.findOneBy({ id });
    if (!existing) throw new NotFoundException(CompanyMessage.NOT_FOUND);
    const updatedCompany = await this.companyRepository.save({ ...existing, ...updateData });
    return {
      message: CompanyMessage.UPDATED,
      data: updatedCompany,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(CompanyMessage.NOT_FOUND);
    return {
      message: CompanyMessage.DELETED,
    };
  }
}
