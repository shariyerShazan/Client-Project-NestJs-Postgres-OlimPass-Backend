import { RedeemMailService } from './../mail/redeem.mail.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addMinutes, addDays, isAfter, isBefore } from 'date-fns';
import { OtpMailService } from 'src/mail/otp.mail.service';

@Injectable()
export class RedeemService {
  constructor(private prisma: PrismaService , private otpMailService : OtpMailService , private redeemMailService: RedeemMailService) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(membershipId: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { membershipId },
    });

    if (!registration) {
      throw new BadRequestException('Membership not found');
    }

    if (!registration.isActive) {
      throw new BadRequestException('Membership inactive');
    }

    const now = new Date();
    if (registration.validTo < now) {
      await this.prisma.registration.update({
        where: { id: registration.id },
        data: { isActive: false },
      });

      throw new BadRequestException('Membership expired');
    }

    let otpWindowStart = registration.otpWindowStart || now;
    let attemptCount = registration.otpAttemptCount;

    const windowEnd = addDays(otpWindowStart, 7);

    if (isBefore(now, windowEnd)) {
      if (attemptCount >= 3) {
        throw new BadRequestException(
          'OTP attempt limit reached. Try again after 7 days.',
        );
      }
    } else {
      otpWindowStart = now;
      attemptCount = 0;
    }

    const otp = this.generateOtp();

    await this.prisma.registration.update({
      where: { id: registration.id },
      data: {
        otp,
        otpExpiresAt: addMinutes(now, 5),
        otpAttemptCount: attemptCount + 1,
        otpWindowStart,
      },
    });

    await this.otpMailService.sendOtpEmail(
        registration.email,
        registration.firstName+' '+registration.lastName,
        otp
      );


    return { success: true, message: 'OTP sent' };
  }

  async redeem(membershipId: string, otp: string, partnerId: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { membershipId },
    });

    if (!registration) {
      throw new BadRequestException('Membership not found');
    }

    if (!registration.otp || registration.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (!registration.otpExpiresAt || isAfter(new Date(), registration.otpExpiresAt)) {
      throw new BadRequestException('OTP expired');
    }

    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new BadRequestException('Partner not found');
    }

    const alreadyRedeemed = await this.prisma.redeem.findFirst({
      where: {
        registrationId: registration.id,
        partnerId,
      },
    });

    if (alreadyRedeemed) {
      throw new BadRequestException('Discount already redeemed');
    }

    await this.prisma.registration.update({
      where: { id: registration.id },
      data: {
        otp: null,
        otpExpiresAt: null,
        otpAttemptCount: 0,
        otpWindowStart: null,
      },
    });

   const redeem = await this.prisma.redeem.create({
    data: {
      registrationId: registration.id,
      partnerId,
    },
    include: {
      registration: true,
      partner: {
        include: { category: true },
      },
    },
  });

   await this.redeemMailService.sendRedeemEmail(
    redeem.registration.email,
    {
      registration: redeem.registration,
      partner: redeem.partner,
      redeemedAt: redeem.redeemedAt,
    }
  );
 return {
    success: true,
    message: 'Redeemed successfully',
    redeem: {
      id: redeem.id,
      redeemedAt: redeem.redeemedAt,
      registration: {
        firstName: redeem.registration.firstName,
        lastName: redeem.registration.lastName,
        email: redeem.registration.email,
        phone: redeem.registration.phone,
        teudatZehut: redeem.registration.teudatZehut,
        aliyahDate: redeem.registration.aliyahDate,
        membershipId: redeem.registration.membershipId,
      },
      partner: {
        name: redeem.partner.name,
        discount: redeem.partner.discount,
        // category: redeem.partner.category.name,
      },
    },
  };
  }
}