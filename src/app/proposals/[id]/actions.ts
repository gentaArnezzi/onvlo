'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/libs/DB';
import { clientsSchema, leadsSchema, organizationSchema, proposalsSchema } from '@/models/Schema';
import { replacePlaceholders } from '@/utils/placeholder';

export async function getPublicProposal(id: number) {
  const [proposal] = await db
    .select()
    .from(proposalsSchema)
    .where(eq(proposalsSchema.id, id))
    .limit(1);

  if (!proposal) {
    return null;
  }

  // Get related client or lead info
  let recipientInfo = null;
  if (proposal.clientId) {
    const [client] = await db
      .select()
      .from(clientsSchema)
      .where(eq(clientsSchema.id, proposal.clientId))
      .limit(1);
    recipientInfo = client;
  } else if (proposal.leadId) {
    const [lead] = await db
      .select()
      .from(leadsSchema)
      .where(eq(leadsSchema.id, proposal.leadId))
      .limit(1);
    recipientInfo = lead;
  }

  // Get organization info for agency placeholders
  const [organization] = await db
    .select()
    .from(organizationSchema)
    .where(eq(organizationSchema.id, proposal.organizationId))
    .limit(1);

  // Replace placeholders
  const processedContent = replacePlaceholders(proposal.content, {
    client: proposal.clientId ? recipientInfo : null,
    lead: proposal.leadId ? recipientInfo : null,
    proposal,
    agency: organization ? { name: organization.name || '' } : null,
  });

  return {
    proposal: {
      ...proposal,
      content: processedContent,
    },
    recipientInfo,
  };
}

export async function signProposal(
  id: number,
  signedBy: string,
) {
  // Get IP address from headers
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const signedIp = forwardedFor?.split(',')[0] || realIp || 'unknown';

  const [proposal] = await db
    .update(proposalsSchema)
    .set({
      status: 'Accepted',
      signedAt: new Date(),
      signedBy,
      signedIp,
    })
    .where(eq(proposalsSchema.id, id))
    .returning();

  return proposal;
}
