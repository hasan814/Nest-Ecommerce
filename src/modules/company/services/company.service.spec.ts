import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyMessage } from '../enums/messages.enum';
import { CompanyEntity } from '../entities/company.entity';
import { LoggerService } from 'src/common/decorators/logger.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { Repository } from 'typeorm';

describe('CompanyService', () => {
  let service: CompanyService;
  let companyRepository: Repository<CompanyEntity>;
  let redisService: RedisService;
  let loggerService: LoggerService;

  const mockCompanyRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockRedisService = {
    del: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: getRepositoryToken(CompanyEntity), useValue: mockCompanyRepository },
        { provide: RedisService, useValue: mockRedisService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    companyRepository = module.get<Repository<CompanyEntity>>(getRepositoryToken(CompanyEntity));
    redisService = module.get<RedisService>(RedisService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const dto = { name: 'TechCorp' };
      const company = new CompanyEntity();
      company.name = dto.name;
      mockCompanyRepository.create.mockReturnValue(company);
      mockCompanyRepository.save.mockResolvedValue(company);
      const result = await service.create(dto);
      expect(result.message).toBe(CompanyMessage.CREATED);
      expect(result.data).toEqual(company);
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      const companies = [new CompanyEntity()];
      mockCompanyRepository.find.mockResolvedValue(companies);
      const result = await service.findAll();
      expect(result.message).toBe(CompanyMessage.RETRIEVED_ALL);
      expect(result.data).toEqual(companies);
    });
  });

  describe('findOne', () => {
    it('should return a company by ID', async () => {
      const company = new CompanyEntity();
      company.id = 1;
      mockCompanyRepository.findOne.mockResolvedValue(company);
      const result = await service.findOne(1);
      expect(result.message).toBe(CompanyMessage.RETRIEVED_ONE);
      expect(result.data).toEqual(company);
    });
    it('should throw error if company not found', async () => {
      mockCompanyRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException(CompanyMessage.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const company = new CompanyEntity();
      company.id = 1;
      const dto = { name: 'NewTechCorp' };
      mockCompanyRepository.findOneBy.mockResolvedValue(company);
      mockCompanyRepository.save.mockResolvedValue(company);
      const result = await service.update(1, dto);
      expect(result.message).toBe(CompanyMessage.UPDATED);
    });
    it('should throw error if company not found for update', async () => {
      mockCompanyRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(999, { name: 'NewTechCorp' })).rejects.toThrow(
        new NotFoundException(CompanyMessage.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should delete a company', async () => {
      mockCompanyRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(result.message).toBe(CompanyMessage.DELETED);
    });
    it('should throw error if company not found for deletion', async () => {
      mockCompanyRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException(CompanyMessage.NOT_FOUND),
      );
    });
  });
});
