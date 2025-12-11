import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { MailService } from 'src/mail/mail.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegisterService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-11-17.clover' });

  constructor(private prisma: PrismaService, private mailService: MailService) {}

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
    // Already registered check
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

    // Validity calculation
    const years = parseInt(dto.validity[0]);
    const validFrom = new Date();
    const validTo = new Date();
    validTo.setFullYear(validFrom.getFullYear() + years);

    const membershipId = await this.generateUniqueMembershipId();

    // Registration creation
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

    const amount = 30000 * years; 

const paymentIntent = await this.stripe.paymentIntents.create({
  amount,
  currency: 'ils',
  confirm: true,
  payment_method_data: {
    type: 'card',
    card: { token: dto.stripeToken },
  } as any,
  automatic_payment_methods: {
    enabled: true,
    allow_redirects: 'never',
  },
  metadata: {
    registrationId: registration.id,
    paymentMethod: dto.paymentMethod,
  },
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
      payment: paymentRecord,
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
