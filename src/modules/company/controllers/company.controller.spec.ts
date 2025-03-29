import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from '../dto/company.dto';
import { UpdateCompanyDto } from '../dto/company.dto';
import { CompanyService } from '../services/company.service';
import { CompanyMessage } from '../enums/messages.enum';
import { CompanyEntity } from '../entities/company.entity';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  const mockCompanyService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const dto: CreateCompanyDto = { name: 'TechCorp' };
      const result = {
        message: CompanyMessage.CREATED,
        data: new CompanyEntity(),
      };
      mockCompanyService.create.mockResolvedValue(result);
      expect(await controller.create(dto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      const result = {
        message: CompanyMessage.RETRIEVED_ALL,
        data: [new CompanyEntity()],
      };
      mockCompanyService.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a company by ID', async () => {
      const result = {
        message: CompanyMessage.RETRIEVED_ONE,
        data: new CompanyEntity(),
      };
      mockCompanyService.findOne.mockResolvedValue(result);
      expect(await controller.findOne(1)).toEqual(result);
    });
    it('should throw an error if company is not found', async () => {
      mockCompanyService.findOne.mockRejectedValue(
        new NotFoundException(CompanyMessage.NOT_FOUND),
      );
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const dto: UpdateCompanyDto = { name: 'NewTechCorp' };
      const result = {
        message: CompanyMessage.UPDATED,
        data: new CompanyEntity(),
      };
      mockCompanyService.update.mockResolvedValue(result);
      expect(await controller.update(1, dto)).toEqual(result);
    });
    it('should throw an error if company is not found for update', async () => {
      mockCompanyService.update.mockRejectedValue(
        new NotFoundException(CompanyMessage.NOT_FOUND),
      );
      await expect(controller.update(999, { name: 'NewTechCorp' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a company', async () => {
      const result = {
        message: CompanyMessage.DELETED,
      };
      mockCompanyService.remove.mockResolvedValue(result);
      expect(await controller.remove(1)).toEqual(result);
    });
    it('should throw an error if company is not found for deletion', async () => {
      mockCompanyService.remove.mockRejectedValue(
        new NotFoundException(CompanyMessage.NOT_FOUND),
      );
      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
