'use server';

import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import {
  clientsSchema,
  invoicesSchema,
  projectsSchema,
  tasksSchema,
} from '@/models/Schema';

export async function getClientByEmail(email: string) {
  const [client] = await db
    .select()
    .from(clientsSchema)
    .where(eq(clientsSchema.email, email))
    .limit(1);

  return client;
}

export async function getClientProjects(clientId: number) {
  const projects = await db
    .select()
    .from(projectsSchema)
    .where(eq(projectsSchema.clientId, clientId))
    .orderBy(projectsSchema.createdAt);

  return projects;
}

export async function getClientInvoices(clientId: number) {
  const invoices = await db
    .select()
    .from(invoicesSchema)
    .where(eq(invoicesSchema.clientId, clientId))
    .orderBy(invoicesSchema.createdAt);

  return invoices;
}

export async function getClientTasks(projectIds: number[]) {
  if (projectIds.length === 0) {
    return [];
  }

  // Get all tasks for client's projects that are visible
  const tasks = await db
    .select()
    .from(tasksSchema)
    .where(eq(tasksSchema.visibleToClient, true));

  // Filter by projectIds (in production, use sql`IN` for better performance)
  return tasks.filter(task => projectIds.includes(task.projectId));
}

export async function getClientFiles(projectIds: number[]) {
  if (projectIds.length === 0) {
    return [];
  }

  const { filesSchema } = await import('@/models/Schema');

  // Get all files for client's projects
  const files = await db
    .select()
    .from(filesSchema)
    .orderBy(filesSchema.createdAt);

  // Filter by projectIds
  return files.filter(file => file.projectId && projectIds.includes(file.projectId));
}

export async function getClientPortalData() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get user email from Clerk
  const { currentUser } = await import('@clerk/nextjs/server');
  const user = await currentUser();

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    throw new Error('User email not found');
  }

  const email = user.emailAddresses[0].emailAddress;

  // Find client by email
  const client = await getClientByEmail(email);

  if (!client) {
    throw new Error('Client not found. Please contact your agency.');
  }

  // Get client's projects
  const projects = await getClientProjects(client.id);

  // Get client's invoices
  const invoices = await getClientInvoices(client.id);

  // Get visible tasks for client's projects
  const projectIds = projects.map(p => p.id);
  const tasks = await getClientTasks(projectIds);

  return {
    client,
    projects,
    invoices,
    tasks,
  };
}

export async function createClientPaymentSession(invoiceId: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get client data to verify ownership
  const data = await getClientPortalData();
  const { client } = data;

  // Get invoice and verify ownership
  const [invoice] = await db
    .select()
    .from(invoicesSchema)
    .where(and(eq(invoicesSchema.id, invoiceId), eq(invoicesSchema.clientId, client.id)))
    .limit(1);

  if (!invoice) {
    throw new Error('Invoice not found or access denied');
  }

  // Get invoice items
  const { invoiceItemsSchema } = await import('@/models/Schema');
  const items = await db
    .select()
    .from(invoiceItemsSchema)
    .where(eq(invoiceItemsSchema.invoiceId, invoiceId));

  // Initialize Stripe
  const { Env } = await import('@/libs/Env');
  const Stripe = (await import('stripe')).default;

  if (!Env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe not configured');
  }

  const stripe = new Stripe(Env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });

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
    success_url: `${Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/invoices/${invoice.id}?success=true`,
    cancel_url: `${Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/invoices/${invoice.id}?canceled=true`,
    metadata: {
      invoiceId: invoice.id.toString(),
      clientId: client.id.toString(),
      source: 'client_portal',
    },
  });

  return session.url;
}
