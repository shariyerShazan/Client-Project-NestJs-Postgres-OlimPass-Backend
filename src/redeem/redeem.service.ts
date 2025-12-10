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

      if (!registration.isActive) {
        throw new Error('Membership is inactive. Please register again.');
      }

        const today = new Date();

        if (registration.validTo < today) {
          await this.prisma.registration.update({
            where: { id: registration.id },
            data: { isActive: false },
          });

          throw new Error('Membership expired. Please register again.');
        }

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
