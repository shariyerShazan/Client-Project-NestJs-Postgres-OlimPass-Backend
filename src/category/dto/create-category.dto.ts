// category/dto/create-category.dto.ts
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PartnerInput {
  @IsString()
  name: string;

  @IsString()
  discount: string;
}

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartnerInput)
  partners: PartnerInput[];
}
