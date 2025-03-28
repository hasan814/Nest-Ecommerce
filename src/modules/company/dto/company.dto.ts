import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'TechCorp', description: 'Company Name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateCompanyDto {
  @ApiProperty({ example: 'NewTechCorp', description: 'New Company name' })
  @IsString()
  name?: string;
}
