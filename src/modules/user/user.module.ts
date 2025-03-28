import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
