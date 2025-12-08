import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegisterService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-11-17.clover" });

  constructor(private prisma: PrismaService) {}

  async createRegistrationWithPayment(dto: CreateRegistrationDto) {
    const validFrom = new Date();
    const validTo = new Date();
    validTo.setFullYear(validFrom.getFullYear() + parseInt(dto.validity[0]));

    const registration = await this.prisma.registration.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        teudatZehut: dto.teudatZehut,
        aliyahDate: new Date(dto.aliyahDate),
        membershipId: Math.floor(100000 + Math.random() * 900000).toString(),
        validFrom,
        validTo,
        isActive: false,
      },
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: 30000, 
      currency: 'ils',
      payment_method_types: ['card'], 
      metadata: { registrationId: registration.id },
    });


    await this.prisma.payment.create({
      data: {
        registrationId: registration.id,
        stripeSessionId: paymentIntent.id, 
        amount: 30000,
        currency: 'ILS',
        status: 'pending',
      },
    });

    return {
      registration,
      clientSecret: paymentIntent.client_secret,
    };
  }
}
