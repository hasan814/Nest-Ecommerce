import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { BaseEntity } from 'src/common/abstarct/base-entity';
import { EntityName } from 'src/common/enums/entity.enum';

@Entity(EntityName.SubCategory)
export class SubcategoryEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.subcategory)
  products: ProductEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.subcategories, { nullable: false })
  category: CategoryEntity;
}
