import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpireRegisterService {
  private readonly logger = new Logger(ExpireRegisterService.name);

  constructor(private prisma: PrismaService) {}


  @Cron(CronExpression.EVERY_HOUR)
  async handleExpireRegistration() {
    const result = await this.prisma.registration.updateMany({
      where: {
        validTo: { lt: new Date() },
        isActive: true,            
      },
      data: { isActive: false , membershipId: "" }, 
    });

    if (result.count > 0) {
      this.logger.log(`${result.count} registration's expired and deactivated.`);
    } else {
      this.logger.log('No registration to expire at this time.');
    }
  }
}
