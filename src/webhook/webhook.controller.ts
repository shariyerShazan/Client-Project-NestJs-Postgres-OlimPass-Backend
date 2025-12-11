import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import  type { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Controller('webhook')
export class WebhookController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-11-17.clover' });

  constructor(private prisma: PrismaService) {}

  @Post()
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response, @Headers('stripe-signature') signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

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

            await this.prisma.registration.update({
            where: { id: registrationId },
            data: { isActive: true },
            });


        console.log(`Payment succeeded for registration ${registrationId}`);
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        const failedRegistrationId = failedIntent.metadata.registrationId;

        await this.prisma.payment.update({
          where: { stripeSessionId: failedIntent.id },
          data: { status: 'failed' },
        });

        console.log(`Payment failed for registration ${failedRegistrationId}`);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
}
