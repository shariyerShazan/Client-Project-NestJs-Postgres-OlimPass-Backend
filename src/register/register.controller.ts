import { Body, Controller, Post, HttpException, HttpStatus, Get, Param } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async register(@Body() createRegistrationDto: CreateRegistrationDto) {
    try {
      const registration = await this.registerService.createRegistrationWithPayment(createRegistrationDto);
      return {
        success: true,
        message: 'Registration successful!',
        data: registration,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Registration failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

    @Get(':id')
  async getRegistrationById(@Param('id') id: string) {
    try {
      const registration = await this.registerService.getRegistrationById(id);
      return {
        success: true,
        data: registration,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Registration not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
