import { Test, TestingModule } from '@nestjs/testing';
import { SubcategoryService } from './subcategory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubcategoryMessage } from '../enums/subcategory-message.enum';
import { SubcategoryEntity } from '../entities/subcategory.entity';
import { NotFoundException } from '@nestjs/common';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { Repository } from 'typeorm';

const mockSubcategory = { id: 1, name: 'Phones', category: {} } as SubcategoryEntity;
const mockCategory = { id: 1, name: 'Electronics' } as CategoryEntity;

const mockSubcategoryRepo = {
  create: jest.fn().mockReturnValue(mockSubcategory),
  save: jest.fn().mockResolvedValue(mockSubcategory),
  find: jest.fn().mockResolvedValue([mockSubcategory]),
  findOne: jest.fn().mockResolvedValue(mockSubcategory),
  delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] }),
};

const mockCategoryRepo = {
  findOneBy: jest.fn().mockResolvedValue(mockCategory),
};

describe('SubcategoryService', () => {
  let service: SubcategoryService;
  let subcategoryRepo: Repository<SubcategoryEntity>;
  let categoryRepo: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubcategoryService,
        {
          provide: getRepositoryToken(SubcategoryEntity),
          useValue: mockSubcategoryRepo,
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: mockCategoryRepo,
        },
      ],
    }).compile();

    service = module.get<SubcategoryService>(SubcategoryService);
    subcategoryRepo = module.get(getRepositoryToken(SubcategoryEntity));
    categoryRepo = module.get(getRepositoryToken(CategoryEntity));
  });

  it('should create a subcategory', async () => {
    const result = await service.create({
      name: 'Phones',
      categoryId: 1,
    });

    expect(result).toEqual({ message: SubcategoryMessage.CREATED, data: mockSubcategory });
    expect(subcategoryRepo.create).toHaveBeenCalledWith({
      name: 'Phones',
      category: mockCategory,
    });
    expect(subcategoryRepo.save).toHaveBeenCalledWith(mockSubcategory);
  });

  it('should find all subcategories', async () => {
    const result = await service.findAll();
    expect(result).toEqual({ message: SubcategoryMessage.RETRIEVED_ALL, data: [mockSubcategory] });
    expect(subcategoryRepo.find).toHaveBeenCalled();
  });

  it('should find one subcategory', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual({ message: SubcategoryMessage.RETRIEVED_ONE, data: mockSubcategory });
    expect(subcategoryRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['category', 'products'],
    });
  });

  it('should throw NotFoundException if subcategory not found (findOne)', async () => {
    jest.spyOn(subcategoryRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a subcategory', async () => {
    const result = await service.update(1, { name: 'Updated Phones' });
    expect(result).toEqual({ message: SubcategoryMessage.UPDATED, data: mockSubcategory });
    expect(subcategoryRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['category'],
    });
    expect(subcategoryRepo.save).toHaveBeenCalledWith(mockSubcategory);
  });

  it('should throw NotFoundException if subcategory not found (update)', async () => {
    jest.spyOn(subcategoryRepo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.update(999, { name: 'Nope' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a subcategory', async () => {
    const result = await service.remove(1);
    expect(result).toEqual({ message: SubcategoryMessage.DELETED });
    expect(subcategoryRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if subcategory not found (delete)', async () => {
    jest.spyOn(subcategoryRepo, 'delete').mockResolvedValueOnce({ affected: 0, raw: [] });
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
