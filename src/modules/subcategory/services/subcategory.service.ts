import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubcategoryDto } from '../dto/subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';
import { SubcategoryMessage } from '../enums/subcategory-message.enum';
import { SubcategoryEntity } from '../entities/subcategory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { LoggerService } from 'src/common/decorators/logger.service';
import { Repository } from 'typeorm';

@Injectable()
export class SubcategoryService {

  constructor(
    @InjectRepository(SubcategoryEntity) private subcategoryRepository: Repository<SubcategoryEntity>,
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
    private logger: LoggerService,
  ) { }

  async create(dto: CreateSubcategoryDto): Promise<{ message: string; data: SubcategoryEntity }> {
    this.logger.log(`Attempting to create subcategory: ${dto.name}`);
    const category = await this.categoryRepository.findOneBy({ id: dto.categoryId });
    if (!category) {
      this.logger.error(`Category with ID ${dto.categoryId} not found`);
      throw new NotFoundException(SubcategoryMessage.CATEGORY_NOT_FOUND);
    }
    const subcategory = this.subcategoryRepository.create({
      name: dto.name,
      category,
    });
    const saved = await this.subcategoryRepository.save(subcategory);
    this.logger.log(`Subcategory created with ID ${saved.id}`);
    return { message: SubcategoryMessage.CREATED, data: saved };
  }

  async findAll(): Promise<{ message: string; data: SubcategoryEntity[] }> {
    this.logger.log('Fetching all subcategories');
    const subcategories = await this.subcategoryRepository.find({
      relations: ['category', 'products'],
    });
    this.logger.log(`Retrieved ${subcategories.length} subcategories`);
    return { message: SubcategoryMessage.RETRIEVED_ALL, data: subcategories };
  }

  async findOne(id: number): Promise<{ message: string; data: SubcategoryEntity }> {
    this.logger.log(`Fetching subcategory with ID ${id}`);
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
      relations: ['category', 'products'],
    });
    if (!subcategory) {
      this.logger.error(`Subcategory with ID ${id} not found`);
      throw new NotFoundException(SubcategoryMessage.NOT_FOUND);
    }
    this.logger.log(`Subcategory retrieved with ID ${id}`);
    return { message: SubcategoryMessage.RETRIEVED_ONE, data: subcategory };
  }

  async update(id: number, dto: UpdateSubcategoryDto): Promise<{ message: string; data: SubcategoryEntity }> {
    this.logger.log(`Updating subcategory with ID ${id}`);
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!subcategory) {
      this.logger.error(`Subcategory with ID ${id} not found for update`);
      throw new NotFoundException(SubcategoryMessage.NOT_FOUND);
    }
    if (dto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: dto.categoryId });
      if (!category) {
        this.logger.error(`Category with ID ${dto.categoryId} not found for update`);
        throw new NotFoundException(SubcategoryMessage.CATEGORY_NOT_FOUND);
      }
      subcategory.category = category;
    }
    Object.assign(subcategory, dto);
    const updated = await this.subcategoryRepository.save(subcategory);
    this.logger.log(`Subcategory updated with ID ${updated.id}`);
    return { message: SubcategoryMessage.UPDATED, data: updated };
  }

  async remove(id: number): Promise<{ message: string }> {
    this.logger.log(`Attempting to delete subcategory with ID ${id}`);
    const result = await this.subcategoryRepository.delete(id);
    if (result.affected === 0) {
      this.logger.error(`Subcategory with ID ${id} not found for deletion`);
      throw new NotFoundException(SubcategoryMessage.NOT_FOUND);
    }
    this.logger.log(`Subcategory with ID ${id} deleted`);
    return { message: SubcategoryMessage.DELETED };
  }
}
