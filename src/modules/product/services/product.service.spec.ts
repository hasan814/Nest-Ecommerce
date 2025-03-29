import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubcategoryEntity } from 'src/modules/subcategory/entities/subcategory.entity';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductMessage } from '../enums/product-message.enum';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { ProductEntity } from '../entities/product.entity';
import { LoggerService } from 'src/common/decorators/logger.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryRepository: Repository<CategoryEntity>;
  let subcategoryRepository: Repository<SubcategoryEntity>;
  let redisService: RedisService;
  let loggerService: LoggerService;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockCategoryRepository = {
    findOneBy: jest.fn(),
  };

  const mockSubcategoryRepository = {
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
        ProductService,
        { provide: getRepositoryToken(ProductEntity), useValue: mockProductRepository },
        { provide: getRepositoryToken(CategoryEntity), useValue: mockCategoryRepository },
        { provide: getRepositoryToken(SubcategoryEntity), useValue: mockSubcategoryRepository },
        { provide: RedisService, useValue: mockRedisService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
    subcategoryRepository = module.get<Repository<SubcategoryEntity>>(getRepositoryToken(SubcategoryEntity));
    redisService = module.get<RedisService>(RedisService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const dto = { name: 'Product1', price: 100, barcode: '123456789', categoryId: 1 };
      const product = new ProductEntity();
      product.name = dto.name;
      mockCategoryRepository.findOneBy.mockResolvedValue(new CategoryEntity());
      mockSubcategoryRepository.findOneBy.mockResolvedValue(null);
      mockProductRepository.create.mockReturnValue(product);
      mockProductRepository.save.mockResolvedValue(product);
      const result = await service.create(dto);
      expect(result.message).toBe(ProductMessage.CREATED);
      expect(result.data).toEqual(product);
    });
    it('should throw error if category not found', async () => {
      const dto = { name: 'Product1', price: 100, barcode: '123456789', categoryId: 1 };
      mockCategoryRepository.findOneBy.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(
        new NotFoundException(ProductMessage.CATEGORY_NOT_FOUND),
      );
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [new ProductEntity()];
      mockProductRepository.find.mockResolvedValue(products);
      const result = await service.findAll();
      expect(result.message).toBe(ProductMessage.RETRIEVED_ALL);
      expect(result.data).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const product = new ProductEntity();
      product.id = 1;
      mockProductRepository.findOne.mockResolvedValue(product);
      const result = await service.findOne(1);
      expect(result.message).toBe(ProductMessage.RETRIEVED_ONE);
      expect(result.data).toEqual(product);
    });
    it('should throw error if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException(ProductMessage.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const product = new ProductEntity();
      product.id = 1;
      const dto = { name: 'Updated Product' };
      mockProductRepository.findOneBy.mockResolvedValue(product);
      mockCategoryRepository.findOneBy.mockResolvedValue(new CategoryEntity());
      mockProductRepository.save.mockResolvedValue(product);
      const result = await service.update(1, dto);
      expect(result.message).toBe(ProductMessage.UPDATED);
    });
    it('should throw error if product not found for update', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(999, { name: 'Updated Product' })).rejects.toThrow(
        new NotFoundException(ProductMessage.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result.message).toBe(ProductMessage.DELETED);
    });
    it('should throw error if product not found for deletion', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException(ProductMessage.NOT_FOUND),
      );
    });
  });

  describe('findByBarcode', () => {
    it('should return a product by barcode', async () => {
      const product = new ProductEntity();
      product.barcode = '123456789';
      mockProductRepository.findOne.mockResolvedValue(product);
      const result = await service.findByBarcode('123456789');
      expect(result.message).toBe(ProductMessage.RETRIEVED_ONE);
      expect(result.data).toEqual(product);
    });
    it('should throw error if product not found by barcode', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);
      await expect(service.findByBarcode('987654321')).rejects.toThrow(
        new NotFoundException(ProductMessage.BARCODE_NOT_FOUND),
      );
    });
  });
});
