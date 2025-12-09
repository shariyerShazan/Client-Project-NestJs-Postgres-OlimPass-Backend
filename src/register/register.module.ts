// src/register/register.module.ts
import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService, PrismaService , MailService],
})
export class RegisterModule {}
