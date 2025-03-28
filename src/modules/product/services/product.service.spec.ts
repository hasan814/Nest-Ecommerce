import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { SubcategoryEntity } from 'src/modules/subcategory/entities/subcategory.entity';
import { ProductMessage } from '../enums/product-message.enum';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { ProductService } from './product.service';
import { ProductEntity } from '../entities/product.entity';
import { Repository } from 'typeorm';

const mockProduct = { id: 1, name: 'Product 1', price: 100, barcode: '12345', category: {} } as ProductEntity;
const mockCategory = { id: 1, name: 'Category 1' } as CategoryEntity;
const mockSubcategory = { id: 1, name: 'Subcategory 1' } as SubcategoryEntity;

const mockProductRepo = {
  create: jest.fn().mockReturnValue(mockProduct),
  save: jest.fn().mockResolvedValue(mockProduct),
  find: jest.fn().mockResolvedValue([mockProduct]),
  findOne: jest.fn().mockResolvedValue(mockProduct),
  delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] }),
};

const mockCategoryRepo = {
  findOneBy: jest.fn().mockResolvedValue(mockCategory),
};

const mockSubcategoryRepo = {
  findOneBy: jest.fn().mockResolvedValue(mockSubcategory),
};

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: Repository<ProductEntity>;
  let categoryRepo: Repository<CategoryEntity>;
  let subcategoryRepo: Repository<SubcategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductRepo,
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: mockCategoryRepo,
        },
        {
          provide: getRepositoryToken(SubcategoryEntity),
          useValue: mockSubcategoryRepo,
        },
      ],
    }).compile();
    service = module.get<ProductService>(ProductService);
    productRepo = module.get(getRepositoryToken(ProductEntity));
    categoryRepo = module.get(getRepositoryToken(CategoryEntity));
    subcategoryRepo = module.get(getRepositoryToken(SubcategoryEntity));
  });
  it('should create a product', async () => {
    const result = await service.create({
      name: 'Product 1',
      price: 100,
      barcode: '12345',
      categoryId: 1,
    });
    expect(result).toEqual({ message: ProductMessage.CREATED, data: mockProduct });
    expect(productRepo.create).toHaveBeenCalledWith({
      name: 'Product 1',
      price: 100,
      barcode: '12345',
      category: mockCategory,
      subcategory: null,
    });
    expect(productRepo.save).toHaveBeenCalledWith(mockProduct);
  });





  it('should get all products', async () => {
    const result = await service.findAll();
    expect(result).toEqual({ message: ProductMessage.RETRIEVED_ALL, data: [mockProduct] });
    expect(productRepo.find).toHaveBeenCalled();
  });

  it('should find one product', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual({ message: ProductMessage.RETRIEVED_ONE, data: mockProduct });
    expect(productRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw NotFoundException if product not found (findOne)', async () => {
    jest.spyOn(productRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a product', async () => {
    const result = await service.update(1, { name: 'Updated Product 1' });
    expect(result).toEqual({ message: ProductMessage.UPDATED, data: mockProduct });
    expect(productRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(productRepo.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if product not found (update)', async () => {
    jest.spyOn(productRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.update(999, { name: 'Updated Product' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a product', async () => {
    const result = await service.remove(1);
    expect(result).toEqual({ message: ProductMessage.DELETED });
    expect(productRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if product not found (delete)', async () => {
    jest.spyOn(productRepo, 'delete').mockResolvedValueOnce({ affected: 0, raw: [] });
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });

  it('should find product by barcode', async () => {
    const result = await service.findByBarcode('12345');
    expect(result).toEqual({ message: ProductMessage.RETRIEVED_ONE, data: mockProduct });
    expect(productRepo.findOne).toHaveBeenCalledWith({ where: { barcode: '12345' } });
  });

  it('should throw NotFoundException if product not found (barcode)', async () => {
    jest.spyOn(productRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findByBarcode('99999')).rejects.toThrow(NotFoundException);
  });
});
