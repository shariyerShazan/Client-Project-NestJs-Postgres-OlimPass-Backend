// category/dto/create-category.dto.ts
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;
}
