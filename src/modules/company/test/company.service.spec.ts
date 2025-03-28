import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CompanyMessage } from '../enums/messages.enum';
import { CompanyEntity } from '../entities/company.entity';
import { Repository } from 'typeorm';

describe('CompanyService', () => {
  let service: CompanyService;
  let repo: Repository<CompanyEntity>;

  const mockCompany = { id: 1, name: 'TestCo' } as CompanyEntity;

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockCompany),
    save: jest.fn().mockResolvedValue(mockCompany),
    find: jest.fn().mockResolvedValue([mockCompany]),
    findOne: jest.fn().mockResolvedValue(mockCompany),
    findOneBy: jest.fn().mockResolvedValue(mockCompany),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(CompanyEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    repo = module.get(getRepositoryToken(CompanyEntity));
  });

  it('should create a company', async () => {
    const result = await service.create({ name: 'TestCo' });
    expect(result).toEqual({
      message: CompanyMessage.CREATED,
      data: mockCompany,
    });
    expect(repo.create).toHaveBeenCalledWith({ name: 'TestCo' });
    expect(repo.save).toHaveBeenCalledWith(mockCompany);
  });

  it('should find all companies', async () => {
    const result = await service.findAll();
    expect(result).toEqual({
      message: CompanyMessage.RETRIEVED_ALL,
      data: [mockCompany],
    });
    expect(repo.find).toHaveBeenCalledWith({ relations: ['product'] });
  });

  it('should find a company by id', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual({
      message: CompanyMessage.RETRIEVED_ONE,
      data: mockCompany,
    });
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['product'],
    });
  });

  it('should throw if company not found (findOne)', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a company', async () => {
    const result = await service.update(1, { name: 'Updated' });
    expect(result).toEqual({
      message: CompanyMessage.UPDATED,
      data: mockCompany,
    });
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if company not found (update)', async () => {
    mockRepo.findOneBy.mockResolvedValueOnce(null);
    await expect(service.update(999, { name: 'Updated' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a company', async () => {
    const result = await service.remove(1);
    expect(result).toEqual({ message: CompanyMessage.DELETED });
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('should throw if company not found (delete)', async () => {
    mockRepo.delete.mockResolvedValueOnce({ affected: 0 });
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
