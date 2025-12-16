import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
