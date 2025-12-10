import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { MailService } from 'src/mail/mail.service';
// import { MailService } from 'src/mail/mail.service';

@Injectable()
export class RegisterService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
  });

  constructor(private prisma: PrismaService ,  private mailService: MailService) {}

  private async generateUniqueMembershipId(): Promise<string> {
    let id: string;
    let exists: boolean;
    do {
      id = Math.floor(100000 + Math.random() * 900000).toString();
      const user = await this.prisma.registration.findUnique({
        where: { membershipId: id },
      });
      exists = !!user;
    } while (exists);
    return id;
  }

  async createRegistrationWithPayment(dto: CreateRegistrationDto) {

  const existing = await this.prisma.registration.findFirst({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { email: dto.email },
              { teudatZehut: dto.teudatZehut },
            ],
          },
        ],
      },
    });

   if (existing) {
    const today = new Date();
    if (existing.validTo > today) {
      throw new Error('You are already registered. Your membership is still valid.');
    }
   }

    const years = parseInt(dto.validity[0])
    const validFrom = new Date();
    const validTo = new Date();
    validTo.setFullYear(validFrom.getFullYear() + parseInt(dto.validity[0]));

    const membershipId = await this.generateUniqueMembershipId();

    const registration = await this.prisma.registration.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        teudatZehut: dto.teudatZehut,
        aliyahDate: new Date(dto.aliyahDate),
        membershipId : membershipId ,
        validFrom,
        validTo,
        isActive: false,
        paymentMethod: dto.paymentMethod,
      },
    });

    let paymentRecord = await this.prisma.payment.create({
      data: {
        registrationId: registration.id,
        amount: 30000 * years,
        currency: 'ILS',
        status: 'pending',
        method: dto.paymentMethod,
      },
    });

    let clientSecret: string | null = null;

    if (dto.paymentMethod === 'stripe') {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 30000 * years,
        currency: 'ils',
        payment_method_types: ['card'],
        metadata: { registrationId: registration.id },
      });

      clientSecret = paymentIntent.client_secret;
        let status = paymentIntent.status;
        // console.log(status, "status-1")
          const start = Date.now();
          while (status !== 'succeeded' && status !== 'requires_payment_method') {
            if (Date.now() - start > 10000) break; 
            await new Promise((r) => setTimeout(r, 1000));
            const pi = await this.stripe.paymentIntents.retrieve(paymentIntent.id);
            status = pi.status;
          }

          if (status === 'succeeded') {
            await this.prisma.registration.update({
              where: { id: registration.id },
              data: { isActive: true, membershipId },
            });
            await this.prisma.payment.update({
              where: { id: paymentRecord.id },
              data: { status: 'succeeded' },
            });
          }
      paymentRecord = await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: { stripeSessionId: paymentIntent.id },
      });
    }

    if (['visa', 'mastercard'].includes(dto.paymentMethod)) {
      if (!dto.cardholderName || !dto.cardNumber || !dto.expireDate || !dto.cvc) {
        throw new Error('Card details are required for Visa/Mastercard payments');
      }

      paymentRecord = await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          cardholderName: dto.cardholderName,
          cardNumber: dto.cardNumber,
          expireDate: dto.expireDate,
          cvc: dto.cvc,
        },
      });

      paymentRecord = await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: { status: 'completed' },
      });

        await this.mailService.sendMembershipEmail(
          registration.email,
          registration.firstName,
          membershipId,
        );
        
      await this.prisma.registration.update({
        where: { id: registration.id },
        data: { isActive: true },
      });
    }

    if (dto.paymentMethod === 'gpay') {

      paymentRecord = await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: { status: 'completed' },
      });
      
        await this.mailService.sendMembershipEmail(
          registration.email,
          registration.firstName,
          membershipId,
        );
        
      await this.prisma.registration.update({
        where: { id: registration.id },
        data: { isActive: true },
      });
    }


    return {
      registration,
      membershipId: membershipId ,
      clientSecret, 
      payment: paymentRecord,
    };
  }
}
