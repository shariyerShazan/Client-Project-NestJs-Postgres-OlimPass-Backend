import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async register(@Body() createRegistrationDto: CreateRegistrationDto) {
    try {
      const registration = await this.registerService.createRegistrationWithPayment(createRegistrationDto);
      return registration;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
