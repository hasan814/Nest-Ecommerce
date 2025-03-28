import { CreateCategoryDto } from './category.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }
