import { IsString } from 'class-validator';

export class SendOtpDto {
  @IsString()
  membershipId: string;
}
