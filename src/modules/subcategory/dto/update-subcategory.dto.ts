import { CreateSubcategoryDto } from './subcategory.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) { }
