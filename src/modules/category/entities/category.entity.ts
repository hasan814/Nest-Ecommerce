import { Entity, Column, OneToMany } from 'typeorm';
import { SubcategoryEntity } from 'src/modules/subcategory/entities/subcategory.entity';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { BaseEntity } from 'src/common/abstarct/base-entity';
import { EntityName } from 'src/common/enums/entity.enum';

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];

  @OneToMany(() => SubcategoryEntity, (subcategory) => subcategory.category)
  subcategories: SubcategoryEntity[];
}
