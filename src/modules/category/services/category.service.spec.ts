import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryMessage } from '../enums/category-message.enum';
import { CategoryEntity } from '../entities/category.entity';
import { Repository } from 'typeorm';

const mockCategory = { id: 1, name: 'Food' } as CategoryEntity;

const mockRepo = {
  create: jest.fn().mockReturnValue(mockCategory),
  save: jest.fn().mockResolvedValue(mockCategory),
  find: jest.fn().mockResolvedValue([mockCategory]),
  findOne: jest.fn().mockResolvedValue(mockCategory),
  findOneBy: jest.fn().mockResolvedValue(mockCategory),
  delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] }),
};

describe('CategoryService', () => {
  let service: CategoryService;
  let repo: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repo = module.get(getRepositoryToken(CategoryEntity));
  });

  it('should create a category', async () => {
    const result = await service.create({ name: 'Food' });
    expect(result).toEqual({ message: CategoryMessage.CREATED, data: mockCategory });
    expect(repo.create).toHaveBeenCalledWith({ name: 'Food' });
    expect(repo.save).toHaveBeenCalledWith(mockCategory);
  });

  it('should get all categories', async () => {
    const result = await service.findAll();
    expect(result).toEqual({ message: CategoryMessage.RETRIEVED_ALL, data: [mockCategory] });
    expect(repo.find).toHaveBeenCalledWith({ relations: ['products', 'subcategories'] });
  });

  it('should find one category', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual({ message: CategoryMessage.RETRIEVED_ONE, data: mockCategory });
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['products', 'subcategories'],
    });
  });

  it('should throw NotFoundException if category not found (findOne)', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a category', async () => {
    const result = await service.update(1, { name: 'UpdatedFood' });
    expect(result).toEqual({ message: CategoryMessage.UPDATED, data: mockCategory });
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if category not found (update)', async () => {
    jest.spyOn(repo, 'findOneBy').mockResolvedValueOnce(null);
    await expect(service.update(999, { name: 'UpdatedFood' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a category', async () => {
    const result = await service.remove(1);
    expect(result).toEqual({ message: CategoryMessage.DELETED });
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if category not found (delete)', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValueOnce({ affected: 0, raw: [] });
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
