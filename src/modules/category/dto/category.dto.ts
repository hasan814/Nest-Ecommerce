import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Food', description: 'Category Name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
