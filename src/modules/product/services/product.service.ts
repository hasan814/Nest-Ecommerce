import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SubcategoryEntity } from 'src/modules/subcategory/entities/subcategory.entity';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from '../dto/product.dto';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { ProductMessage } from '../enums/product-message.enum';
import { LoggerService } from 'src/common/decorators/logger.service';
import { ProductEntity } from '../entities/product.entity';
import { RedisService } from 'src/modules/redis/redis.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(SubcategoryEntity) private subcategoryRepository: Repository<SubcategoryEntity>,
    private redisService: RedisService,
    private logger: LoggerService,
  ) { }

  async create(data: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({ id: data.categoryId });
    if (!category) {
      this.logger.error(`Category with ID ${data.categoryId} not found for creating product`);
      throw new NotFoundException(ProductMessage.CATEGORY_NOT_FOUND);
    }
    let subcategory: SubcategoryEntity | null = null;
    if (data.subcategoryId) {
      subcategory = await this.subcategoryRepository.findOneBy({ id: data.subcategoryId });
      if (!subcategory) {
        this.logger.error(`Subcategory with ID ${data.subcategoryId} not found for creating product`);
        throw new NotFoundException(ProductMessage.SUBCATEGORY_NOT_FOUND);
      }
    }
    const product = this.productRepository.create({ ...data, category, subcategory });
    const saved = await this.productRepository.save(product);
    this.logger.log(`Product created: ${saved.name}`);
    return { message: ProductMessage.CREATED, data: saved };
  }

  async findAll() {
    const cachedProducts = await this.redisService.get<ProductEntity[]>('products');
    if (cachedProducts) {
      this.logger.log('Returning cached products');
      return { message: ProductMessage.RETRIEVED_ALL, data: cachedProducts };
    }
    const products = await this.productRepository.find();
    await this.redisService.set('products', products, 3600);
    this.logger.log('Returning all products');
    return { message: ProductMessage.RETRIEVED_ALL, data: products };
  }

  async findOne(id: number) {
    const cachedProduct = await this.redisService.get<ProductEntity>(`product:${id}`);
    if (cachedProduct) {
      this.logger.log(`Returning cached product with ID ${id}`);
      return { message: ProductMessage.RETRIEVED_ONE, data: cachedProduct };
    }
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      this.logger.error(`Product with ID ${id} not found`);
      throw new NotFoundException(ProductMessage.NOT_FOUND);
    }
    await this.redisService.set(`product:${id}`, product, 3600);
    this.logger.log(`Returning product with ID ${id}`);
    return { message: ProductMessage.RETRIEVED_ONE, data: product };
  }

  async update(id: number, updateData: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      this.logger.error(`Product with ID ${id} not found for update`);
      throw new NotFoundException(ProductMessage.NOT_FOUND);
    }
    Object.assign(product, updateData)
    if (updateData.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: updateData.categoryId });
      if (!category) {
        this.logger.error(`Category with ID ${updateData.categoryId} not found for updating product`);
        throw new NotFoundException(ProductMessage.CATEGORY_NOT_FOUND);
      }
      product.category = category;
    }
    if ('subcategoryId' in updateData) {
      if (updateData.subcategoryId === null) {
        product.subcategory = null;
      } else {
        const subcategory = await this.subcategoryRepository.findOneBy({ id: updateData.subcategoryId });
        if (!subcategory) {
          this.logger.error(`Subcategory with ID ${updateData.subcategoryId} not found for updating product`);
          throw new NotFoundException(ProductMessage.SUBCATEGORY_NOT_FOUND);
        }
        product.subcategory = subcategory;
      }
    }
    const updated = await this.productRepository.save(product);
    this.logger.log(`Product updated: ${updated.name}`);
    return { message: ProductMessage.UPDATED, data: updated };
  }

  async remove(id: number) {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      this.logger.error(`Product with ID ${id} not found for deletion`);
      throw new NotFoundException(ProductMessage.NOT_FOUND);
    }
    this.logger.log(`Product deleted with ID ${id}`);
    return { message: ProductMessage.DELETED };
  }

  async findByBarcode(barcode: string) {
    const product = await this.productRepository.findOne({ where: { barcode } });
    if (!product) {
      this.logger.error(`Product with barcode ${barcode} not found`);
      throw new NotFoundException(ProductMessage.BARCODE_NOT_FOUND);
    }
    this.logger.log(`Product found by barcode: ${barcode}`);
    return { message: ProductMessage.RETRIEVED_ONE, data: product };
  }
}
