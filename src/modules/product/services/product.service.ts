import { Injectable, NotFoundException } from '@nestjs/common';
import { SubcategoryEntity } from 'src/modules/subcategory/entities/subcategory.entity';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from '../dto/product.dto';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { ProductMessage } from '../enums/product-message.enum';
import { ProductEntity } from '../entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(SubcategoryEntity) private subcategoryRepository: Repository<SubcategoryEntity>,
  ) { }

  async create(data: CreateProductDto): Promise<{ message: string; data: ProductEntity }> {
    const category = await this.categoryRepository.findOneBy({ id: data.categoryId });
    if (!category) throw new NotFoundException(ProductMessage.CATEGORY_NOT_FOUND);
    let subcategory: SubcategoryEntity | null = null;
    if (data.subcategoryId) {
      subcategory = await this.subcategoryRepository.findOneBy({ id: data.subcategoryId });
      if (!subcategory) throw new NotFoundException(ProductMessage.SUBCATEGORY_NOT_FOUND);
    }
    const product = this.productRepository.create({ ...data, category, subcategory });
    const saved = await this.productRepository.save(product);
    return { message: ProductMessage.CREATED, data: saved };
  }

  async findAll(): Promise<{ message: string; data: ProductEntity[] }> {
    const products = await this.productRepository.find();
    return { message: ProductMessage.RETRIEVED_ALL, data: products };
  }

  async findOne(id: number): Promise<{ message: string; data: ProductEntity }> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(ProductMessage.NOT_FOUND);
    return { message: ProductMessage.RETRIEVED_ONE, data: product };
  }

  async update(id: number, updateData: UpdateProductDto): Promise<{ message: string; data: ProductEntity }> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(ProductMessage.NOT_FOUND);
    Object.assign(product, updateData)
    if (updateData.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: updateData.categoryId });
      if (!category) throw new NotFoundException(ProductMessage.CATEGORY_NOT_FOUND);
      product.category = category;
    }
    if ('subcategoryId' in updateData) {
      if (updateData.subcategoryId === null) {
        product.subcategory = null;
      } else {
        const subcategory = await this.subcategoryRepository.findOneBy({ id: updateData.subcategoryId });
        if (!subcategory) throw new NotFoundException(ProductMessage.SUBCATEGORY_NOT_FOUND);
        product.subcategory = subcategory;
      }
    }
    const updated = await this.productRepository.save(product);
    return { message: ProductMessage.UPDATED, data: updated };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(ProductMessage.NOT_FOUND);
    return { message: ProductMessage.DELETED };
  }

  async findByBarcode(barcode: string): Promise<{ message: string; data: ProductEntity }> {
    const product = await this.productRepository.findOne({ where: { barcode } });
    if (!product) throw new NotFoundException(ProductMessage.BARCODE_NOT_FOUND);
    return { message: ProductMessage.RETRIEVED_ONE, data: product };
  }
}
