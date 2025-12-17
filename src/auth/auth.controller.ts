// auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  // Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
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


    @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Roles('ADMIN')
  @Post('reset-password')
  resetPassword(
    @Req() req: any,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.service.resetPassword(req.user.id, dto);
  }

}
