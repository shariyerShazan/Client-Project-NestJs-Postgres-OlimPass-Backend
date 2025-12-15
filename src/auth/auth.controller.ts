// auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
// import { JwtAuthGuard, RolesGuard } from './guards/roles.guard';
// import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.service.login(dto, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    return this.service.logout(res);
  }


}
