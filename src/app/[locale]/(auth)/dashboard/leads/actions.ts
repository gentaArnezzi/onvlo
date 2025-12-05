'use server';

import { db } from '@/libs/DB';
import { leadsSchema } from '@/models/Schema';
import { requireAuth } from '@/utils/permissions';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  stage: z.enum(['New', 'Qualified', 'Proposal Sent', 'Won', 'Lost']).default('New'),
  notes: z.string().optional().nullable(),
});

export async function createLead(data: z.infer<typeof createLeadSchema>) {
  const { orgId } = await requireAuth();
  const validated = createLeadSchema.parse(data);

  const [lead] = await db
    .insert(leadsSchema)
    .values({
      ...validated,
      organizationId: orgId,
    })
    .returning();

  return lead;
}

export async function getLeads() {
  const { orgId } = await requireAuth();

  const leads = await db
    .select()
    .from(leadsSchema)
    .where(eq(leadsSchema.organizationId, orgId))
    .orderBy(leadsSchema.createdAt);

  return leads;
}

export async function getLeadById(id: number) {
  const { orgId } = await requireAuth();

  const [lead] = await db
    .select()
    .from(leadsSchema)
    .where(and(eq(leadsSchema.id, id), eq(leadsSchema.organizationId, orgId)))
    .limit(1);

  return lead;
}

export async function updateLead(
  id: number,
  data: Partial<z.infer<typeof createLeadSchema>>,
) {
  const { orgId } = await requireAuth();

  const [lead] = await db
    .update(leadsSchema)
    .set(data)
    .where(and(eq(leadsSchema.id, id), eq(leadsSchema.organizationId, orgId)))
    .returning();

  return lead;
}

export async function deleteLead(id: number) {
  const { orgId } = await requireAuth();

  await db
    .delete(leadsSchema)
    .where(and(eq(leadsSchema.id, id), eq(leadsSchema.organizationId, orgId)));
}

export async function convertLeadToClient(leadId: number) {
  const { orgId } = await requireAuth();

  const lead = await getLeadById(leadId);
  if (!lead) {
    throw new Error('Lead not found');
  }

  // Import clients actions
  const { createClient } = await import('../clients/actions');

  // Create client from lead
  const client = await createClient({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    notes: lead.notes,
  });

  // Update lead status to Won
  await updateLead(leadId, { stage: 'Won' });

  return client;
}

