import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import  type { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Controller('webhook')
export class WebhookController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-11-17.clover' });

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
  constructor(private prisma: PrismaService , private mailService: MailService) {}

  @Post()
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response, @Headers('stripe-signature') signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;
    const membershipId = await this.generateUniqueMembershipId();

    try {
      event = this.stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err) {
      console.log('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.created': 
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const registrationId = paymentIntent.metadata.registrationId;

            await this.prisma.payment.update({
            where: { stripeSessionId: paymentIntent.id },
            data: { status: 'succeeded' }, 
            });

          const registration =  await this.prisma.registration.update({
            where: { id: registrationId },
            data: { isActive: true , membershipId: membershipId},
            });

        await this.mailService.sendMembershipEmail(
          registration.email,
          registration.firstName,
          membershipId,
        );
        
        console.log(`Payment succeeded for registration ${registrationId}`);
        break;

      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        const failedRegistrationId = failedIntent.metadata.registrationId;

        await this.prisma.registration.update({
        where: { id: failedRegistrationId},
        data: {
               membershipId: "",
            isActive: false,
        },
      });
      console.log("fail")
        await this.prisma.payment.update({
          where: { stripeSessionId: failedIntent.id },
          data: { status: 'failed' },
        });

        console.log(`Payment failed for registration ${failedRegistrationId}`);
         console.log(`Unhandled event type ${event.type}`);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
}
