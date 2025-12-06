'use server';

import Stripe from 'stripe';

import { Env } from '@/libs/Env';

import { getInvoiceById } from './actions';

const stripe = Env.STRIPE_SECRET_KEY
  ? new Stripe(Env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  })
  : null;

export async function createPaymentLink(invoiceId: number) {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const invoiceData = await getInvoiceById(invoiceId);

  if (!invoiceData) {
    throw new Error('Invoice not found');
  }

  const { invoice, items } = invoiceData;

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.description,
        },
        unit_amount: Math.round(item.unitPrice * 100), // Convert to cents
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/invoices/${invoice.id}?success=true`,
    cancel_url: `${Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/invoices/${invoice.id}?canceled=true`,
    metadata: {
      invoiceId: invoice.id.toString(),
    },
  });

  return session.url;
}
