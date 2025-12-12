import { IsString } from 'class-validator';

export class RedeemDto {
  @IsString()
  membershipId: string;

  @IsString()
  otp: string;

  @IsString()
  partnerId: string;
}
