import { SupplierEntity } from "src/modules/supplier/entities/supplier.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { IUser } from "src/modules/user/enums/user-interface";

declare global {
  namespace Express {
    export interface Request {
      user?: IUser
    }
  }
}