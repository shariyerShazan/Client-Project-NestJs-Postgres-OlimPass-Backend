import { Module } from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { RedeemController } from './redeem.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OtpMailService } from 'src/mail/otp.mail.service';

@Module({
  controllers: [RedeemController],
  providers: [RedeemService, PrismaService , OtpMailService],
})
export class RedeemModule {}
