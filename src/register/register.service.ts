import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { MailService } from 'src/mail/mail.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegisterService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-11-17.clover' });

  constructor(private prisma: PrismaService) {}
//   private generate6DigitId(): string {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   }

  private async generateUniqueMembershipId(): Promise<string> {
    let id: string;
    let exists: boolean;
    do {
      id = Math.floor(100000 + Math.random() * 900000).toString();
      const user = await this.prisma.registration.findUnique({ where: { membershipId: id } });
      exists = !!user;
    } while (exists);
    return id;
  }

  async createRegistrationWithPayment(dto: CreateRegistrationDto) {


     const emailExists = await this.prisma.registration.findUnique({
    where: { email: dto.email },
  });
  if (emailExists) {
    throw new Error('Email already registered');
  }

  const teudatZehutExists = await this.prisma.registration.findUnique({
    where: { teudatZehut: dto.teudatZehut },
  });
  if (teudatZehutExists) {
    throw new Error('Teudat Zehut already registered');
  }

    const validFrom = new Date();
    const validTo = new Date();
    validTo.setFullYear(validFrom.getFullYear() + years);

    const membershipId = await this.generateUniqueMembershipId();

    // Unique membershipId generate
    const membershipId = await this.generateUniqueMembershipId();

    // Registration create
    const registration = await this.prisma.registration.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        teudatZehut: dto.teudatZehut,
        aliyahDate: new Date(dto.aliyahDate),
        membershipId,  
        validFrom,
        validTo,
        isActive: false,
        paymentMethod: dto.paymentMethod,
      },
    });


    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: 30000, 
      currency: 'ils',
      payment_method_types: ['card'], 
      metadata: { registrationId: registration.id },
    });






    // Save payment record
    const paymentRecord = await this.prisma.payment.create({
      data: {
        registrationId: registration.id,
        amount,
        currency: 'ILS',
        status: paymentIntent.status === 'succeeded' ? 'paid' : 'pending',
        method: dto.paymentMethod,
        stripeSessionId: paymentIntent.id,
      },
    });

     await this.mailService.sendMembershipEmail(
          registration.email,
          registration.firstName,
          membershipId,
        );

    return {
      registration,
      membershipId,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async getRegistrationById(id: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { id },
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    return registration;
  }
}
