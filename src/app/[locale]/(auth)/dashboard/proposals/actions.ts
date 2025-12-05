'use server';

import { db } from '@/libs/DB';
import { proposalsSchema, proposalTemplatesSchema } from '@/models/Schema';
import { requireAuth } from '@/utils/permissions';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const createProposalTemplateSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
});

export async function createProposalTemplate(
  data: z.infer<typeof createProposalTemplateSchema>,
) {
  const { orgId } = await requireAuth();
  const validated = createProposalTemplateSchema.parse(data);

  const [template] = await db
    .insert(proposalTemplatesSchema)
    .values({
      ...validated,
      organizationId: orgId,
    })
    .returning();

  return template;
}

export async function getProposalTemplates() {
  const { orgId } = await requireAuth();

  const templates = await db
    .select()
    .from(proposalTemplatesSchema)
    .where(eq(proposalTemplatesSchema.organizationId, orgId))
    .orderBy(proposalTemplatesSchema.createdAt);

  return templates;
}

export async function getProposalTemplateById(id: number) {
  const { orgId } = await requireAuth();

  const [template] = await db
    .select()
    .from(proposalTemplatesSchema)
    .where(
      and(
        eq(proposalTemplatesSchema.id, id),
        eq(proposalTemplatesSchema.organizationId, orgId),
      ),
    )
    .limit(1);

  return template;
}

const createProposalSchema = z.object({
  templateId: z.number().optional().nullable(),
  clientId: z.number().optional().nullable(),
  leadId: z.number().optional().nullable(),
  content: z.string().min(1),
  status: z.enum(['Draft', 'Sent', 'Accepted', 'Rejected']).default('Draft'),
  proposalData: z.record(z.any()).optional(), // Data untuk placeholder replacement
});

export async function createProposal(data: z.infer<typeof createProposalSchema>) {
  const { orgId } = await requireAuth();
  const validated = createProposalSchema.parse(data);

  // Render content with placeholders if proposalData provided
  let renderedContent = validated.content;
  if (validated.proposalData) {
    const { renderProposalTemplate } = await import('@/utils/proposal-renderer');
    renderedContent = renderProposalTemplate(validated.content, validated.proposalData);
  }

  const [proposal] = await db
    .insert(proposalsSchema)
    .values({
      templateId: validated.templateId,
      clientId: validated.clientId,
      leadId: validated.leadId,
      content: renderedContent,
      status: validated.status,
      organizationId: orgId,
    })
    .returning();

  return proposal;
}

export async function getProposals() {
  const { orgId } = await requireAuth();

  const proposals = await db
    .select()
    .from(proposalsSchema)
    .where(eq(proposalsSchema.organizationId, orgId))
    .orderBy(proposalsSchema.createdAt);

  return proposals;
}

export async function getProposalById(id: number) {
  const { orgId } = await requireAuth();

  const [proposal] = await db
    .select()
    .from(proposalsSchema)
    .where(
      and(
        eq(proposalsSchema.id, id),
        eq(proposalsSchema.organizationId, orgId),
      ),
    )
    .limit(1);

  return proposal;
}

export async function updateProposal(
  id: number,
  data: Partial<z.infer<typeof createProposalSchema>>,
) {
  const { orgId } = await requireAuth();

  const [proposal] = await db
    .update(proposalsSchema)
    .set(data)
    .where(
      and(
        eq(proposalsSchema.id, id),
        eq(proposalsSchema.organizationId, orgId),
      ),
    )
    .returning();

  return proposal;
}

export async function signProposal(
  id: number,
  signedBy: string,
  signedIp: string,
) {
  const { orgId } = await requireAuth();

  const [proposal] = await db
    .update(proposalsSchema)
    .set({
      status: 'Accepted',
      signedAt: new Date(),
      signedBy,
      signedIp,
    })
    .where(
      and(
        eq(proposalsSchema.id, id),
        eq(proposalsSchema.organizationId, orgId),
      ),
    )
    .returning();

  return proposal;
}

