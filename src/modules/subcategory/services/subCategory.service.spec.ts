import { Test, TestingModule } from '@nestjs/testing';
import { SubcategoryMessage } from '../enums/subcategory-message.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryEntity } from '../entities/subcategory.entity';
import { NotFoundException } from '@nestjs/common';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { LoggerService } from 'src/common/decorators/logger.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { Repository } from 'typeorm';

describe('SubcategoryService', () => {
  let service: SubcategoryService;
  let subcategoryRepository: Repository<SubcategoryEntity>;
  let categoryRepository: Repository<CategoryEntity>;
  let redisService: RedisService;
  let loggerService: LoggerService;

  const mockSubcategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockCategoryRepository = {
    findOneBy: jest.fn(),
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
        SubcategoryService,
        { provide: getRepositoryToken(SubcategoryEntity), useValue: mockSubcategoryRepository },
        { provide: getRepositoryToken(CategoryEntity), useValue: mockCategoryRepository },
        { provide: RedisService, useValue: mockRedisService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();
    service = module.get<SubcategoryService>(SubcategoryService);
    subcategoryRepository = module.get<Repository<SubcategoryEntity>>(getRepositoryToken(SubcategoryEntity));
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
    redisService = module.get<RedisService>(RedisService);
    loggerService = module.get<LoggerService>(LoggerService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new subcategory', async () => {
      const dto = { name: 'Phones', categoryId: 1 };
      const category = new CategoryEntity();
      category.id = 1;
      mockCategoryRepository.findOneBy.mockResolvedValue(category);
      const subcategory = new SubcategoryEntity();
      subcategory.name = dto.name;
      subcategory.category = category;
      mockSubcategoryRepository.create.mockReturnValue(subcategory);
      mockSubcategoryRepository.save.mockResolvedValue(subcategory);
      const result = await service.create(dto);
      expect(result.message).toBe(SubcategoryMessage.CREATED);
      expect(result.data).toEqual(subcategory);
    });
    it('should throw error if category not found', async () => {
      const dto = { name: 'Phones', categoryId: 999 };
      mockCategoryRepository.findOneBy.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(
        new NotFoundException(SubcategoryMessage.CATEGORY_NOT_FOUND),
      );
    });
  });

  describe('findAll', () => {
    it('should return all subcategories', async () => {
      const subcategories = [new SubcategoryEntity()];
      mockSubcategoryRepository.find.mockResolvedValue(subcategories);
      const result = await service.findAll();
      expect(result.message).toBe(SubcategoryMessage.RETRIEVED_ALL);
      expect(result.data).toEqual(subcategories);
    });
  });

  describe('findOne', () => {
    it('should return a subcategory by ID', async () => {
      const subcategory = new SubcategoryEntity();
      subcategory.id = 1;
      mockSubcategoryRepository.findOne.mockResolvedValue(subcategory);
      const result = await service.findOne(1);
      expect(result.message).toBe(SubcategoryMessage.RETRIEVED_ONE);
      expect(result.data).toEqual(subcategory);
    });
    it('should throw error if subcategory not found', async () => {
      mockSubcategoryRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException(SubcategoryMessage.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update a subcategory', async () => {
      const subcategory = new SubcategoryEntity();
      subcategory.id = 1;
      const dto = { name: 'Updated Phones' };
      mockSubcategoryRepository.findOne.mockResolvedValue(subcategory);
      mockSubcategoryRepository.save.mockResolvedValue(subcategory);
      const result = await service.update(1, dto);
      expect(result.message).toBe(SubcategoryMessage.UPDATED);
    });
    it('should throw error if subcategory not found for update', async () => {
      mockSubcategoryRepository.findOne.mockResolvedValue(null);
      await expect(service.update(999, { name: 'Updated Phones' })).rejects.toThrow(
        new NotFoundException(SubcategoryMessage.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should delete a subcategory', async () => {
      mockSubcategoryRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result.message).toBe(SubcategoryMessage.DELETED);
    });
    it('should throw error if subcategory not found for deletion', async () => {
      mockSubcategoryRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException(SubcategoryMessage.NOT_FOUND),
      );
    });
  });
});
