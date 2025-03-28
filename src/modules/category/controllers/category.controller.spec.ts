import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { NotFoundException } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategoryMessage } from '../enums/category-message.enum';
import { CategoryEntity } from '../entities/category.entity';

const mockCategory = { id: 1, name: 'Food' } as CategoryEntity;

const mockCategoryService = {
  create: jest.fn().mockResolvedValue({ message: CategoryMessage.CREATED, data: mockCategory }),
  findAll: jest.fn().mockResolvedValue({ message: CategoryMessage.RETRIEVED_ALL, data: [mockCategory] }),
  findOne: jest.fn().mockResolvedValue({ message: CategoryMessage.RETRIEVED_ONE, data: mockCategory }),
  update: jest.fn().mockResolvedValue({ message: CategoryMessage.UPDATED, data: mockCategory }),
  remove: jest.fn().mockResolvedValue({ message: CategoryMessage.DELETED }),
};

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should create a category', async () => {
    const result = await controller.create({ name: 'Food' });
    expect(result).toEqual({ message: CategoryMessage.CREATED, data: mockCategory });
    expect(mockCategoryService.create).toHaveBeenCalledWith({ name: 'Food' });
  });

  it('should get all categories', async () => {
    const result = await controller.findAll();
    expect(result).toEqual({ message: CategoryMessage.RETRIEVED_ALL, data: [mockCategory] });
    expect(mockCategoryService.findAll).toHaveBeenCalled();
  });

  it('should get one category', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({ message: CategoryMessage.RETRIEVED_ONE, data: mockCategory });
    expect(mockCategoryService.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if category not found (findOne)', async () => {
    jest.spyOn(mockCategoryService, 'findOne').mockRejectedValueOnce(new NotFoundException(CategoryMessage.NOT_FOUND));
    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a category', async () => {
    const result = await controller.update(1, { name: 'UpdatedFood' });
    expect(result).toEqual({ message: CategoryMessage.UPDATED, data: mockCategory });
    expect(mockCategoryService.update).toHaveBeenCalledWith(1, { name: 'UpdatedFood' });
  });

  it('should throw NotFoundException if category not found (update)', async () => {
    jest.spyOn(mockCategoryService, 'update').mockRejectedValueOnce(new NotFoundException(CategoryMessage.NOT_FOUND));
    await expect(controller.update(999, { name: 'UpdatedFood' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a category', async () => {
    const result = await controller.remove(1);
    expect(result).toEqual({ message: CategoryMessage.DELETED });
    expect(mockCategoryService.remove).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if category not found (delete)', async () => {
    jest.spyOn(mockCategoryService, 'remove').mockRejectedValueOnce(new NotFoundException(CategoryMessage.NOT_FOUND));
    await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
  });
});
