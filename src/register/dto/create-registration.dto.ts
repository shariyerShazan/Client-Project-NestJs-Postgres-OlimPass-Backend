import { IsString, IsEmail, IsOptional, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
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

  @IsString() @IsNotEmpty()
  cardNumber: string;

  @IsString() @IsNotEmpty()
  expireDate: string;

  @IsString() @IsNotEmpty()
  cvc: string;

  @IsEnum(['stripe','visa','mastercard','gpay'])
  paymentMethod: string;
}
