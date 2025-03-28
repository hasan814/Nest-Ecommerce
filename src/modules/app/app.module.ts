import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig())],
  controllers: [],
  providers: [],
})
export class AppModule { }
