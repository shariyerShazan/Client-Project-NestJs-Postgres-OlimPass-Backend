import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RedeemService {
  constructor(private prisma: PrismaService) {}

  async getCategoriesWithPartners() {
    return this.prisma.category.findMany({
      include: { partners: true },
    });
  }
  
  async redeemDiscount(membershipId: string, partnerId: string) {

    const registration = await this.prisma.registration.findUnique({
      where: { membershipId },
    });
    if (!registration) throw new Error('Membership not found');


    const partner = await this.prisma.partner.findUnique({ where: { id: partnerId } });
    if (!partner) throw new Error('Partner not found');

    const alreadyRedeemed = await this.prisma.redeem.findFirst({
      where: {
        registrationId: registration.id,
        partnerId: partner.id,
      },
    });
    if (alreadyRedeemed) throw new Error('Discount already redeemed for this partner');

    return this.prisma.redeem.create({
      data: {
        registrationId: registration.id,
        partnerId: partner.id,
      },
    });
  }
}
