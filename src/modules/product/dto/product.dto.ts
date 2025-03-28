import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  barcode: string;

  @ApiProperty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  subcategoryId?: number;
}
