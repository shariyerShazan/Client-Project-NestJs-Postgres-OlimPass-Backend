import { IsString, IsEmail, IsOptional, IsDateString, IsEnum, IsNotEmpty, isString } from 'class-validator';
// import { Type } from 'class-transformer';

export class CreateRegistrationDto {
  @IsString() @IsNotEmpty()
  firstName: string;

  @IsString() @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString() @IsOptional()
  phone?: string;

  @IsString() @IsNotEmpty()
  teudatZehut: string;

  @IsDateString() 
  aliyahDate: string;

  @IsEnum(['1 year','2 years','3 years'])
  validity: string;

  @IsString() @IsNotEmpty()
  cardholderName: string;

  @IsEnum(['stripe','visa','mastercard','gpay'])
  paymentMethod: string;

  @IsString() @IsNotEmpty()
  stripeToken: string;
}
