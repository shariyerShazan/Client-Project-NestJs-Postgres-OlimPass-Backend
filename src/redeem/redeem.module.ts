import { Module } from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { RedeemController } from './redeem.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RedeemController],
  providers: [RedeemService, PrismaService],
})
export class RedeemModule {}
