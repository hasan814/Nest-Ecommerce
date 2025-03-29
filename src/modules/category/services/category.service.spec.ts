import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CategoryMessage } from '../enums/category-message.enum';
import { CategoryService } from './category.service';
import { CategoryEntity } from '../entities/category.entity';
import { LoggerService } from 'src/common/decorators/logger.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { Repository } from 'typeorm';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;
  let redisService: RedisService;
  let loggerService: LoggerService;

  const mockCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockRedisService = {
    del: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: getRepositoryToken(CategoryEntity), useValue: mockCategoryRepository },
        { provide: RedisService, useValue: mockRedisService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
    redisService = module.get<RedisService>(RedisService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const dto = { name: 'Food' };
      const category = new CategoryEntity();
      category.name = dto.name;
      mockCategoryRepository.create.mockReturnValue(category);
      mockCategoryRepository.save.mockResolvedValue(category);
      const result = await service.create(dto);
      expect(result.message).toBe(CategoryMessage.CREATED);
      expect(result.data).toEqual(category);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [new CategoryEntity()];
      mockCategoryRepository.find.mockResolvedValue(categories);
      const result = await service.findAll();
      expect(result.message).toBe(CategoryMessage.RETRIEVED_ALL);
      expect(result.data).toEqual(categories);
    });
  });

  describe('findOne', () => {
    it('should return a category by ID', async () => {
      const category = new CategoryEntity();
      category.id = 1;
      mockCategoryRepository.findOne.mockResolvedValue(category);
      const result = await service.findOne(1);
      expect(result.message).toBe(CategoryMessage.RETRIEVED_ONE);
      expect(result.data).toEqual(category);
    });
    it('should throw error if category not found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException(CategoryMessage.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const category = new CategoryEntity();
      category.id = 1;
      const dto = { name: 'Updated Food' };
      mockCategoryRepository.findOneBy.mockResolvedValue(category);
      mockCategoryRepository.save.mockResolvedValue(category);
      const result = await service.update(1, dto);
      expect(result.message).toBe(CategoryMessage.UPDATED);
    });
    it('should throw error if category not found for update', async () => {
      mockCategoryRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(999, { name: 'Updated Food' })).rejects.toThrow(
        new NotFoundException(CategoryMessage.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockCategoryRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result.message).toBe(CategoryMessage.DELETED);
    });
    it('should throw error if category not found for deletion', async () => {
      mockCategoryRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException(CategoryMessage.NOT_FOUND),
      );
    });
  });
});
