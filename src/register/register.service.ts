import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegisterService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
  });

  constructor(private prisma: PrismaService) {}

  // Generate unique 6-digit membership ID
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
    // 1️⃣ Check duplicates
    const emailExists = await this.prisma.registration.findUnique({
      where: { email: dto.email },
    });
    if (emailExists) throw new Error('Email already registered');

    const teudatZehutExists = await this.prisma.registration.findUnique({
      where: { teudatZehut: dto.teudatZehut },
    });
    if (teudatZehutExists) throw new Error('Teudat Zehut already registered');

    // 2️⃣ Validity dates (keep as-is)
    const validFrom = new Date();
    const validTo = new Date();
    validTo.setFullYear(validFrom.getFullYear() + parseInt(dto.validity[0]));

    // 3️⃣ Generate membership ID
    const membershipId = await this.generateUniqueMembershipId();

    // 4️⃣ Create registration
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

    // 5️⃣ Create Payment row first (pending)
    let paymentRecord = await this.prisma.payment.create({
      data: {
        registrationId: registration.id,
        amount: 30000,
        currency: 'ILS',
        status: 'pending',
        method: dto.paymentMethod,
      },
    });

    let clientSecret: string | null = null;

    // 6️⃣ Handle Stripe payments
    if (dto.paymentMethod === 'stripe') {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 30000,
        currency: 'ils',
        payment_method_types: ['card'],
        metadata: { registrationId: registration.id },
      });

      clientSecret = paymentIntent.client_secret;

      // Update Payment with stripeSessionId
      paymentRecord = await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: { stripeSessionId: paymentIntent.id },
      });
    }

    // 7️⃣ Handle Visa/Mastercard
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

      // For simplicity, mark card payments as completed immediately
      paymentRecord = await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: { status: 'completed' },
      });

      await this.prisma.registration.update({
        where: { id: registration.id },
        data: { isActive: true },
      });
    }

    // 8️⃣ Handle GPay
    if (dto.paymentMethod === 'gpay') {
      // GPay payments considered completed immediately
      paymentRecord = await this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: { status: 'completed' },
      });

      await this.prisma.registration.update({
        where: { id: registration.id },
        data: { isActive: true },
      });
    }

    return {
      registration,
      membershipId,
      clientSecret, // only used for Stripe frontend confirmation
      payment: paymentRecord,
    };
  }
}
