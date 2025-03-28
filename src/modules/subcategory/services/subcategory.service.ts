import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubcategoryDto } from '../dto/subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';
import { SubcategoryMessage } from '../enums/subcategory-message.enum';
import { SubcategoryEntity } from '../entities/subcategory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(SubcategoryEntity) private subcategoryRepository: Repository<SubcategoryEntity>,
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
  ) { }

  async create(dto: CreateSubcategoryDto): Promise<{ message: string; data: SubcategoryEntity }> {
    const category = await this.categoryRepository.findOneBy({ id: dto.categoryId });
    if (!category) throw new NotFoundException(SubcategoryMessage.CATEGORY_NOT_FOUND);
    const subcategory = this.subcategoryRepository.create({
      name: dto.name,
      category,
    });
    const saved = await this.subcategoryRepository.save(subcategory);
    return { message: SubcategoryMessage.CREATED, data: saved };
  }

  async findAll(): Promise<{ message: string; data: SubcategoryEntity[] }> {
    const subcategories = await this.subcategoryRepository.find({
      relations: ['category', 'products'],
    });
    return { message: SubcategoryMessage.RETRIEVED_ALL, data: subcategories };
  }

  async findOne(id: number): Promise<{ message: string; data: SubcategoryEntity }> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
      relations: ['category', 'products'],
    });
    if (!subcategory) throw new NotFoundException(SubcategoryMessage.NOT_FOUND);
    return { message: SubcategoryMessage.RETRIEVED_ONE, data: subcategory };
  }

  async update(id: number, dto: UpdateSubcategoryDto): Promise<{ message: string; data: SubcategoryEntity }> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!subcategory) throw new NotFoundException(SubcategoryMessage.NOT_FOUND);
    if (dto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: dto.categoryId });
      if (!category) throw new NotFoundException(SubcategoryMessage.CATEGORY_NOT_FOUND);
      subcategory.category = category;
    }
    Object.assign(subcategory, dto);
    const updated = await this.subcategoryRepository.save(subcategory);
    return { message: SubcategoryMessage.UPDATED, data: updated };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.subcategoryRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(SubcategoryMessage.NOT_FOUND);
    return { message: SubcategoryMessage.DELETED };
  }
}
