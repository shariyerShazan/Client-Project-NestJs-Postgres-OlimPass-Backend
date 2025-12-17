// partner/dto/create-partner.dto.ts
import { IsString, IsInt, Min } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  name: string;

  @IsString()
  discount: string;

  @IsString()
  categoryId: string;

  @IsInt()
  @Min(0)
  maxRedeems: number;
}
