import { CreateSubcategoryDto } from '../dto/subcategory.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubcategoryService {
  create(createSubcategoryDto: CreateSubcategoryDto) {
    return 'This action adds a new subcategory';
  }

  findAll() {
    return `This action returns all subcategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subcategory`;
  }
}
