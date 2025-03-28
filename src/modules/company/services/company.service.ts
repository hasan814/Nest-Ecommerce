import { CreateCompanyDto } from '../dto/company.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyService {
  create(createCompanyDto: CreateCompanyDto) {
    return 'This action adds a new company';
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

}
