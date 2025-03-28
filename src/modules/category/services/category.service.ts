import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryMessage } from '../enums/category-message.enum';
import { CategoryEntity } from '../entities/category.entity';
import { LoggerService } from 'src/common/decorators/logger.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
    private redisService: RedisService,
    private logger: LoggerService,
  ) { }

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create(dto);
    const saved = await this.categoryRepository.save(category);
    this.logger.log(`Category created: ${saved.name}`);  // Log the message
    return { message: CategoryMessage.CREATED, data: saved };
  }

  async findAll() {
    const cachedCategories = await this.redisService.get<CategoryEntity[]>('categories');
    if (cachedCategories) {
      this.logger.log('Fetched categories from cache');
      return { message: CategoryMessage.RETRIEVED_ALL, data: cachedCategories };
    }
    const categories = await this.categoryRepository.find({
      relations: ['products', 'subcategories'],
    });
    await this.redisService.set('categories', categories, 3600);
    this.logger.log('Fetched categories from database');
    return { message: CategoryMessage.RETRIEVED_ALL, data: categories };
  }

  async findOne(id: number) {
    const cachedCategory = await this.redisService.get<CategoryEntity>(`category:${id}`);
    if (cachedCategory) {
      this.logger.log(`Fetched category ${id} from cache`);
      return { message: CategoryMessage.RETRIEVED_ONE, data: cachedCategory };
    }
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products', 'subcategories'],
    });
    if (!category) {
      this.logger.error(`Category with id ${id} not found`);
      throw new NotFoundException(CategoryMessage.NOT_FOUND);
    }
    await this.redisService.set(`category:${id}`, category, 3600);
    this.logger.log(`Fetched category ${id} from database`);
    return { message: CategoryMessage.RETRIEVED_ONE, data: category };
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      this.logger.error(`Category with id ${id} not found for update`);
      throw new NotFoundException(CategoryMessage.NOT_FOUND);
    }
    Object.assign(category, dto);
    const updated = await this.categoryRepository.save(category);
    this.logger.log(`Category updated: ${updated.name}`);
    return { message: CategoryMessage.UPDATED, data: updated };
  }

  async remove(id: number) {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      this.logger.error(`Category with id ${id} not found for deletion`);
      throw new NotFoundException(CategoryMessage.NOT_FOUND);
    }
    await this.redisService.del(`category:${id}`);
    this.logger.log(`Category deleted with id ${id}`);
    return { message: CategoryMessage.DELETED };
  }
}
