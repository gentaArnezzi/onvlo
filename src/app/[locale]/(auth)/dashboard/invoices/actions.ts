'use server';

import { db } from '@/libs/DB';
import { invoiceItemsSchema, invoicesSchema } from '@/models/Schema';
import { requireAuth } from '@/utils/permissions';
import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
});

const createInvoiceSchema = z.object({
  clientId: z.number(),
  projectId: z.number().optional().nullable(),
  invoiceNumber: z.string().min(1),
  dueDate: z.date(),
  taxRate: z.number().default(0),
  notes: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).min(1),
});

export async function createInvoice(data: z.infer<typeof createInvoiceSchema>) {
  const { orgId } = await requireAuth();
  const validated = createInvoiceSchema.parse(data);

  // Calculate totals
  const subtotal = validated.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const tax = subtotal * (validated.taxRate / 100);
  const total = subtotal + tax;

  // Create invoice
  const [invoice] = await db
    .insert(invoicesSchema)
    .values({
      organizationId: orgId,
      clientId: validated.clientId,
      projectId: validated.projectId || null,
      invoiceNumber: validated.invoiceNumber,
      dueDate: validated.dueDate,
      subtotal,
      tax,
      taxRate: validated.taxRate,
      total,
      notes: validated.notes,
      status: 'Draft',
    })
    .returning();

  // Create invoice items
  const items = await db
    .insert(invoiceItemsSchema)
    .values(
      validated.items.map((item) => ({
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
    )
    .returning();

  return { invoice, items };
}

export async function getInvoices() {
  const { orgId } = await requireAuth();

  const invoices = await db
    .select()
    .from(invoicesSchema)
    .where(eq(invoicesSchema.organizationId, orgId))
    .orderBy(invoicesSchema.createdAt);

  // Mark overdue invoices
  const today = new Date();
  for (const invoice of invoices) {
    if (
      invoice.status === 'Sent'
      && invoice.dueDate < today
      && invoice.status !== 'Overdue'
    ) {
      await db
        .update(invoicesSchema)
        .set({ status: 'Overdue' })
        .where(eq(invoicesSchema.id, invoice.id));
      invoice.status = 'Overdue';
    }
  }

  return invoices;
}

export async function getInvoiceById(id: number) {
  const { orgId } = await requireAuth();

  const [invoice] = await db
    .select()
    .from(invoicesSchema)
    .where(and(eq(invoicesSchema.id, id), eq(invoicesSchema.organizationId, orgId)))
    .limit(1);

  if (!invoice) {
    return null;
  }

  const items = await db
    .select()
    .from(invoiceItemsSchema)
    .where(eq(invoiceItemsSchema.invoiceId, id));

  return { invoice, items };
}

export async function updateInvoice(
  id: number,
  data: Partial<z.infer<typeof createInvoiceSchema>>,
) {
  const { orgId } = await requireAuth();

  const updateData: any = { ...data };
  delete updateData.items;

  // Recalculate totals if items are updated
  if (data.items && data.items.length > 0) {
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const taxRate = data.taxRate ?? 0;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    updateData.subtotal = subtotal;
    updateData.tax = tax;
    updateData.taxRate = taxRate;
    updateData.total = total;

    // Update items
    await db.delete(invoiceItemsSchema).where(eq(invoiceItemsSchema.invoiceId, id));

    await db.insert(invoiceItemsSchema).values(
      data.items.map((item) => ({
        invoiceId: id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
    );
  }

  const [invoice] = await db
    .update(invoicesSchema)
    .set(updateData)
    .where(and(eq(invoicesSchema.id, id), eq(invoicesSchema.organizationId, orgId)))
    .returning();

  return invoice;
}

export async function deleteInvoice(id: number) {
  const { orgId } = await requireAuth();

  // Delete items first
  await db.delete(invoiceItemsSchema).where(eq(invoiceItemsSchema.invoiceId, id));

  // Delete invoice
  await db
    .delete(invoicesSchema)
    .where(and(eq(invoicesSchema.id, id), eq(invoicesSchema.organizationId, orgId)));
}

export async function sendInvoice(id: number) {
  const { orgId } = await requireAuth();

  const [invoice] = await db
    .update(invoicesSchema)
    .set({ status: 'Sent' })
    .where(and(eq(invoicesSchema.id, id), eq(invoicesSchema.organizationId, orgId)))
    .returning();

  return invoice;
}

export async function markInvoicePaid(id: number, paymentIntentId?: string) {
  const { orgId } = await requireAuth();

  const [invoice] = await db
    .update(invoicesSchema)
    .set({
      status: 'Paid',
      paidAt: new Date(),
      stripePaymentIntentId: paymentIntentId || null,
    })
    .where(and(eq(invoicesSchema.id, id), eq(invoicesSchema.organizationId, orgId)))
    .returning();

  return invoice;
}

