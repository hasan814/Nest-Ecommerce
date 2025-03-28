import { SubcategoryController } from './subcategory.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubcategoryMessage } from '../enums/subcategory-message.enum';
import { SubcategoryService } from '../services/subcategory.service';
import { SubcategoryEntity } from '../entities/subcategory.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { Repository } from 'typeorm';

const mockSubcategory = { id: 1, name: 'Phones', category: {} } as SubcategoryEntity;
const mockCategory = { id: 1, name: 'Electronics' } as CategoryEntity;

const mockSubcategoryRepo = {
  create: jest.fn().mockReturnValue(mockSubcategory),
  save: jest.fn().mockResolvedValue(mockSubcategory),
  find: jest.fn().mockResolvedValue([mockSubcategory]),
  findOne: jest.fn().mockResolvedValue(mockSubcategory),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
};

const mockCategoryRepo = {
  findOneBy: jest.fn().mockResolvedValue(mockCategory),
};

describe('SubcategoryController', () => {
  let controller: SubcategoryController;
  let service: SubcategoryService;
  let subcategoryRepo: Repository<SubcategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcategoryController],
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

    controller = module.get<SubcategoryController>(SubcategoryController);
    service = module.get<SubcategoryService>(SubcategoryService);
    subcategoryRepo = module.get(getRepositoryToken(SubcategoryEntity));
  });

  it('should create a subcategory', async () => {
    const result = await controller.create({
      name: 'Phones',
      categoryId: 1,
    });

    expect(result).toEqual({ message: SubcategoryMessage.CREATED, data: mockSubcategory });
  });

  it('should get all subcategories', async () => {
    const result = await controller.findAll();
    expect(result).toEqual({ message: SubcategoryMessage.RETRIEVED_ALL, data: [mockSubcategory] });
  });

  it('should get a subcategory by ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({ message: SubcategoryMessage.RETRIEVED_ONE, data: mockSubcategory });
  });

  it('should update a subcategory', async () => {
    const result = await controller.update(1, { name: 'Updated Phones' });
    expect(result).toEqual({ message: SubcategoryMessage.UPDATED, data: mockSubcategory });
  });

  it('should delete a subcategory', async () => {
    const result = await controller.remove(1);
    expect(result).toEqual({ message: SubcategoryMessage.DELETED });
  });
});
