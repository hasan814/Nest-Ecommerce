import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { ProductMessage } from '../enums/product-message.enum';
import { ProductEntity } from '../entities/product.entity';

const mockProduct = { id: 1, name: 'Product 1', price: 100, barcode: '12345', category: {} } as ProductEntity;

const mockProductService = {
  create: jest.fn().mockResolvedValue({ message: ProductMessage.CREATED, data: mockProduct }),
  findAll: jest.fn().mockResolvedValue({ message: ProductMessage.RETRIEVED_ALL, data: [mockProduct] }),
  findOne: jest.fn().mockResolvedValue({ message: ProductMessage.RETRIEVED_ONE, data: mockProduct }),
  update: jest.fn().mockResolvedValue({ message: ProductMessage.UPDATED, data: mockProduct }),
  remove: jest.fn().mockResolvedValue({ message: ProductMessage.DELETED }),
  findByBarcode: jest.fn().mockResolvedValue({ message: ProductMessage.RETRIEVED_ONE, data: mockProduct }),
};

describe('ProductController', () => {
  let controller: ProductController;

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
  });

  it('should create a product', async () => {
    const result = await controller.create({
      name: 'Product 1',
      price: 100,
      barcode: '12345',
      categoryId: 1,
    });
    expect(result).toEqual({ message: ProductMessage.CREATED, data: mockProduct });
    expect(mockProductService.create).toHaveBeenCalledWith({
      name: 'Product 1',
      price: 100,
      barcode: '12345',
      categoryId: 1,
    });
  });

  it('should get all products', async () => {
    const result = await controller.findAll();
    expect(result).toEqual({ message: ProductMessage.RETRIEVED_ALL, data: [mockProduct] });
    expect(mockProductService.findAll).toHaveBeenCalled();
  });

  it('should get one product', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({ message: ProductMessage.RETRIEVED_ONE, data: mockProduct });
    expect(mockProductService.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if product not found (findOne)', async () => {
    jest.spyOn(mockProductService, 'findOne').mockRejectedValueOnce(new NotFoundException(ProductMessage.NOT_FOUND));
    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a product', async () => {
    const result = await controller.update(1, { name: 'Updated Product 1' });
    expect(result).toEqual({ message: ProductMessage.UPDATED, data: mockProduct });
    expect(mockProductService.update).toHaveBeenCalledWith(1, { name: 'Updated Product 1' });
  });

  it('should throw NotFoundException if product not found (update)', async () => {
    jest.spyOn(mockProductService, 'update').mockRejectedValueOnce(new NotFoundException(ProductMessage.NOT_FOUND));
    await expect(controller.update(999, { name: 'Updated Product 1' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a product', async () => {
    const result = await controller.remove(1);
    expect(result).toEqual({ message: ProductMessage.DELETED });
    expect(mockProductService.remove).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if product not found (delete)', async () => {
    jest.spyOn(mockProductService, 'remove').mockRejectedValueOnce(new NotFoundException(ProductMessage.NOT_FOUND));
    await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
  });

  it('should find product by barcode', async () => {
    const result = await controller.findByBarcode('12345');
    expect(result).toEqual({ message: ProductMessage.RETRIEVED_ONE, data: mockProduct });
    expect(mockProductService.findByBarcode).toHaveBeenCalledWith('12345');
  });

  it('should throw NotFoundException if product not found (barcode)', async () => {
    jest.spyOn(mockProductService, 'findByBarcode').mockRejectedValueOnce(new NotFoundException(ProductMessage.BARCODE_NOT_FOUND));
    await expect(controller.findByBarcode('99999')).rejects.toThrow(NotFoundException);
  });
});
