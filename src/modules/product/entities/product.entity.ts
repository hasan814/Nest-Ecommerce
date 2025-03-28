import { Entity, Column, ManyToOne } from 'typeorm';
import { SubcategoryEntity } from 'src/modules/subcategory/entities/subcategory.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { BaseEntity } from 'src/common/abstarct/base-entity';
import { EntityName } from 'src/common/enums/entity.enum';

@Entity(EntityName.Product)
export class ProductEntity extends BaseEntity {
  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ unique: true })
  barcode: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products, { nullable: false })
  category: CategoryEntity;

  @ManyToOne(() => SubcategoryEntity, (subcategory) => subcategory.products, { nullable: true })
  subcategory: SubcategoryEntity | null;
}
