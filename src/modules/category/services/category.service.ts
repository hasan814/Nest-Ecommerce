import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryMessage } from '../enums/category-message.enum';
import { CategoryEntity } from '../entities/category.entity';
import { RedisService } from 'src/modules/redis/redis.service';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
    private redisService: RedisService,
  ) { }

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create(dto);
    const saved = await this.categoryRepository.save(category);
    return { message: CategoryMessage.CREATED, data: saved };
  }

  async findAll() {
    const cachedCategories = await this.redisService.get<CategoryEntity[]>('categories');
    if (cachedCategories) {
      return { message: CategoryMessage.RETRIEVED_ALL, data: cachedCategories };
    }
    const categories = await this.categoryRepository.find({
      relations: ['products', 'subcategories'],
    });
    await this.redisService.set('categories', categories, 3600);
    return { message: CategoryMessage.RETRIEVED_ALL, data: categories };
  }

  async findOne(id: number) {
    const cachedCategory = await this.redisService.get<CategoryEntity>(`category:${id}`);
    if (cachedCategory) {
      return { message: CategoryMessage.RETRIEVED_ONE, data: cachedCategory };
    }
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products', 'subcategories'],
    });
    if (!category) throw new NotFoundException(CategoryMessage.NOT_FOUND);
    await this.redisService.set(`category:${id}`, category, 3600);
    return { message: CategoryMessage.RETRIEVED_ONE, data: category };
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(CategoryMessage.NOT_FOUND);
    Object.assign(category, dto);
    const updated = await this.categoryRepository.save(category);
    return { message: CategoryMessage.UPDATED, data: updated };
  }

  async remove(id: number) {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(CategoryMessage.NOT_FOUND);
    await this.redisService.del(`category:${id}`);
    return { message: CategoryMessage.DELETED };
  }

}
