import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from '../services/company.service';
import { CompanyMessage } from '../enums/messages.enum';
import { CompanyEntity } from '../entities/company.entity';

const mockCompany = { id: 1, name: 'TechCorp' } as CompanyEntity;

const mockCompanyService = {
  create: jest.fn().mockResolvedValue({ message: CompanyMessage.CREATED, data: mockCompany }),
  findAll: jest.fn().mockResolvedValue({ message: CompanyMessage.RETRIEVED_ALL, data: [mockCompany] }),
  findOne: jest.fn().mockResolvedValue({ message: CompanyMessage.RETRIEVED_ONE, data: mockCompany }),
  update: jest.fn().mockResolvedValue({ message: CompanyMessage.UPDATED, data: mockCompany }),
  remove: jest.fn().mockResolvedValue({ message: CompanyMessage.DELETED }),
};

describe('CompanyController', () => {
  let controller: CompanyController;

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
  });

  it('should create a company', async () => {
    const result = await controller.create({ name: 'TechCorp' });
    expect(result).toEqual({ message: CompanyMessage.CREATED, data: mockCompany });
    expect(mockCompanyService.create).toHaveBeenCalledWith({ name: 'TechCorp' });
  });

  it('should get all companies', async () => {
    const result = await controller.findAll();
    expect(result).toEqual({ message: CompanyMessage.RETRIEVED_ALL, data: [mockCompany] });
    expect(mockCompanyService.findAll).toHaveBeenCalled();
  });

  it('should get one company', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({ message: CompanyMessage.RETRIEVED_ONE, data: mockCompany });
    expect(mockCompanyService.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if company not found (findOne)', async () => {
    jest.spyOn(mockCompanyService, 'findOne').mockRejectedValueOnce(new NotFoundException(CompanyMessage.NOT_FOUND));
    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a company', async () => {
    const result = await controller.update(1, { name: 'UpdatedCorp' });
    expect(result).toEqual({ message: CompanyMessage.UPDATED, data: mockCompany });
    expect(mockCompanyService.update).toHaveBeenCalledWith(1, { name: 'UpdatedCorp' });
  });

  it('should throw NotFoundException if company not found (update)', async () => {
    jest.spyOn(mockCompanyService, 'update').mockRejectedValueOnce(new NotFoundException(CompanyMessage.NOT_FOUND));
    await expect(controller.update(999, { name: 'UpdatedCorp' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a company', async () => {
    const result = await controller.remove(1);
    expect(result).toEqual({ message: CompanyMessage.DELETED });
    expect(mockCompanyService.remove).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if company not found (delete)', async () => {
    jest.spyOn(mockCompanyService, 'remove').mockRejectedValueOnce(new NotFoundException(CompanyMessage.NOT_FOUND));
    await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
  });
});
