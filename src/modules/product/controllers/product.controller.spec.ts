import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductService } from '../services/product.service';
import { ProductMessage } from '../enums/product-message.enum';
import { ProductEntity } from '../entities/product.entity';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByBarcode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const dto: CreateProductDto = { name: 'Product1', price: 100, barcode: '123456789', categoryId: 1 };
      const result = {
        message: ProductMessage.CREATED,
        data: new ProductEntity(),
      };
      mockProductService.create.mockResolvedValue(result);
      expect(await controller.create(dto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const result = {
        message: ProductMessage.RETRIEVED_ALL,
        data: [new ProductEntity()],
      };
      mockProductService.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const result = {
        message: ProductMessage.RETRIEVED_ONE,
        data: new ProductEntity(),
      };
      mockProductService.findOne.mockResolvedValue(result);
      expect(await controller.findOne(1)).toEqual(result);
    });
    it('should throw an error if product is not found', async () => {
      mockProductService.findOne.mockRejectedValue(
        new NotFoundException(ProductMessage.NOT_FOUND),
      );
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto: UpdateProductDto = { name: 'Updated Product' };
      const result = {
        message: ProductMessage.UPDATED,
        data: new ProductEntity(),
      };
      mockProductService.update.mockResolvedValue(result);
      expect(await controller.update(1, dto)).toEqual(result);
    });
    it('should throw an error if product is not found for update', async () => {
      mockProductService.update.mockRejectedValue(
        new NotFoundException(ProductMessage.NOT_FOUND),
      );
      await expect(controller.update(999, { name: 'Updated Product' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const result = {
        message: ProductMessage.DELETED,
      };
      mockProductService.remove.mockResolvedValue(result);
      expect(await controller.remove(1)).toEqual(result);
    });
    it('should throw an error if product is not found for deletion', async () => {
      mockProductService.remove.mockRejectedValue(
        new NotFoundException(ProductMessage.NOT_FOUND),
      );
      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByBarcode', () => {
    it('should return a product by barcode', async () => {
      const result = {
        message: ProductMessage.RETRIEVED_ONE,
        data: new ProductEntity(),
      };
      mockProductService.findByBarcode.mockResolvedValue(result);
      expect(await controller.findByBarcode('123456789')).toEqual(result);
    });
    it('should throw an error if product is not found by barcode', async () => {
      mockProductService.findByBarcode.mockRejectedValue(
        new NotFoundException(ProductMessage.BARCODE_NOT_FOUND),
      );
      await expect(controller.findByBarcode('987654321')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
