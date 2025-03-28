import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { BaseEntity } from 'src/common/abstarct/base-entity';
import { EntityName } from 'src/common/enums/entity.enum';

@Entity(EntityName.Company)
export class CompanyEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToOne(() => ProductEntity, { cascade: true })
  @JoinColumn()
  product: ProductEntity;
}
