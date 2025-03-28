import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSubcategoryDto {
  @ApiProperty({ example: 'Phones', description: 'Subcategory name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: 'Category ID (number)' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
