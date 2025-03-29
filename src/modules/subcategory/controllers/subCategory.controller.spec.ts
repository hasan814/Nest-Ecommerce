import { SubcategoryController } from './subcategory.controller';
import { CreateSubcategoryDto } from '../dto/subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { SubcategoryService } from '../services/subcategory.service';
import { SubcategoryMessage } from '../enums/subcategory-message.enum';
import { SubcategoryEntity } from '../entities/subcategory.entity';
import { NotFoundException } from '@nestjs/common';

describe('SubcategoryController', () => {
  let controller: SubcategoryController;
  let service: SubcategoryService;

  const mockSubcategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcategoryController],
      providers: [
        {
          provide: SubcategoryService,
          useValue: mockSubcategoryService,
        },
      ],
    }).compile();
    controller = module.get<SubcategoryController>(SubcategoryController);
    service = module.get<SubcategoryService>(SubcategoryService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new subcategory', async () => {
      const dto: CreateSubcategoryDto = { name: 'Phones', categoryId: 1 };
      const result = {
        message: SubcategoryMessage.CREATED,
        data: new SubcategoryEntity(),
      };
      mockSubcategoryService.create.mockResolvedValue(result);
      expect(await controller.create(dto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all subcategories', async () => {
      const result = {
        message: SubcategoryMessage.RETRIEVED_ALL,
        data: [new SubcategoryEntity()],
      };
      mockSubcategoryService.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a subcategory by ID', async () => {
      const result = {
        message: SubcategoryMessage.RETRIEVED_ONE,
        data: new SubcategoryEntity(),
      };
      mockSubcategoryService.findOne.mockResolvedValue(result);
      expect(await controller.findOne(1)).toEqual(result);
    });
    it('should throw an error if subcategory is not found', async () => {
      mockSubcategoryService.findOne.mockRejectedValue(
        new NotFoundException(SubcategoryMessage.NOT_FOUND),
      );
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a subcategory', async () => {
      const dto: UpdateSubcategoryDto = { name: 'Updated Phones' };
      const result = {
        message: SubcategoryMessage.UPDATED,
        data: new SubcategoryEntity(),
      };
      mockSubcategoryService.update.mockResolvedValue(result);
      expect(await controller.update(1, dto)).toEqual(result);
    });
    it('should throw an error if subcategory is not found for update', async () => {
      mockSubcategoryService.update.mockRejectedValue(
        new NotFoundException(SubcategoryMessage.NOT_FOUND),
      );
      await expect(controller.update(999, { name: 'Updated Phones' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a subcategory', async () => {
      const result = {
        message: SubcategoryMessage.DELETED,
      };
      mockSubcategoryService.remove.mockResolvedValue(result);
      expect(await controller.remove(1)).toEqual(result);
    });
    it('should throw an error if subcategory is not found for deletion', async () => {
      mockSubcategoryService.remove.mockRejectedValue(
        new NotFoundException(SubcategoryMessage.NOT_FOUND),
      );
      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
