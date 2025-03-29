import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CreateCategoryDto } from '../dto/category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { NotFoundException } from '@nestjs/common';
import { CategoryMessage } from '../enums/category-message.enum';
import { CategoryService } from '../services/category.service';
import { CategoryEntity } from '../entities/category.entity';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

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
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const dto: CreateCategoryDto = { name: 'Food' };
      const result = {
        message: CategoryMessage.CREATED,
        data: new CategoryEntity(),
      };
      mockCategoryService.create.mockResolvedValue(result);
      expect(await controller.create(dto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const result = {
        message: CategoryMessage.RETRIEVED_ALL,
        data: [new CategoryEntity()],
      };
      mockCategoryService.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a category by ID', async () => {
      const result = {
        message: CategoryMessage.RETRIEVED_ONE,
        data: new CategoryEntity(),
      };
      mockCategoryService.findOne.mockResolvedValue(result);
      expect(await controller.findOne(1)).toEqual(result);
    });
    it('should throw an error if category is not found', async () => {
      mockCategoryService.findOne.mockRejectedValue(
        new NotFoundException(CategoryMessage.NOT_FOUND),
      );
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const dto: UpdateCategoryDto = { name: 'Updated Food' };
      const result = {
        message: CategoryMessage.UPDATED,
        data: new CategoryEntity(),
      };
      mockCategoryService.update.mockResolvedValue(result);
      expect(await controller.update(1, dto)).toEqual(result);
    });
    it('should throw an error if category is not found for update', async () => {
      mockCategoryService.update.mockRejectedValue(
        new NotFoundException(CategoryMessage.NOT_FOUND),
      );
      await expect(controller.update(999, { name: 'Updated Food' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      const result = {
        message: CategoryMessage.DELETED,
      };
      mockCategoryService.remove.mockResolvedValue(result);
      expect(await controller.remove(1)).toEqual(result);
    });
    it('should throw an error if category is not found for deletion', async () => {
      mockCategoryService.remove.mockRejectedValue(
        new NotFoundException(CategoryMessage.NOT_FOUND),
      );
      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
