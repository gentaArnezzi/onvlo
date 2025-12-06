import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { db } from '@/libs/DB';
import { Env } from '@/libs/Env';
import { invoicesSchema } from '@/models/Schema';

const stripe = Env.STRIPE_SECRET_KEY
  ? new Stripe(Env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  })
  : null;

export async function POST(req: Request) {
  if (!stripe || !Env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoiceId;

    if (invoiceId) {
      await db
        .update(invoicesSchema)
        .set({
          status: 'Paid',
          paidAt: new Date(),
          stripePaymentIntentId: session.payment_intent as string,
        })
        .where(eq(invoicesSchema.id, Number(invoiceId)));
    }
  } else if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const invoiceId = paymentIntent.metadata?.invoiceId;

    if (invoiceId) {
      await db
        .update(invoicesSchema)
        .set({
          status: 'Paid',
          paidAt: new Date(),
          stripePaymentIntentId: paymentIntent.id,
        })
        .where(eq(invoicesSchema.id, Number(invoiceId)));
    }
  }

  return NextResponse.json({ received: true });
}
