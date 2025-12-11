// partner/dto/create-partner.dto.ts
import { IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  name: string;

  @IsString()
  discount: string;

  @IsString()
  categoryId: string;
}
