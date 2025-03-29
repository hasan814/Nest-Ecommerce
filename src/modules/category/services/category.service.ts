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
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private redisService: RedisService,
    private logger: LoggerService,
  ) { }

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create(dto);
    const saved = await this.categoryRepository.save(category);
    await this.redisService.del('categories');
    this.logger.log(`Category created: ${saved.name}`);
    return { message: CategoryMessage.CREATED, data: saved };
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      relations: ['products', 'subcategories'],
    });
    this.logger.log('Returned categories from DB');
    return { message: CategoryMessage.RETRIEVED_ALL, data: categories };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products', 'subcategories'],
    });
    if (!category) {
      this.logger.error(`Category with id ${id} not found`);
      throw new NotFoundException(CategoryMessage.NOT_FOUND);
    }
    this.logger.log(`Returned category ${id} from DB`);
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
    await this.redisService.del(`category:${id}`);
    await this.redisService.del('categories');
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
    await this.redisService.del('categories');
    this.logger.log(`Category deleted with id ${id}`);
    return { message: CategoryMessage.DELETED };
  }
}
