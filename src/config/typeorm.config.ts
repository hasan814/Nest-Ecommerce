import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { SubcategoryEntity } from "src/modules/subcategory/entities/subcategory.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { ProductEntity } from "src/modules/product/entities/product.entity";
import { CompanyEntity } from "src/modules/company/entities/company.entity";

import * as dotenv from "dotenv";

dotenv.config();


export function TypeOrmConfig(): TypeOrmModuleOptions {
  const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env
  return {
    type: "mysql",
    host: DB_HOST,
    port: Number(DB_PORT) || 3306,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    autoLoadEntities: true,
    synchronize: false,
    entities: [
      ProductEntity,
      CompanyEntity,
      CategoryEntity,
      SubcategoryEntity,
    ],
  }
}