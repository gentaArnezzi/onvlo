'use server';

import { db } from '@/libs/DB';
import { proposalsSchema, clientsSchema, leadsSchema } from '@/models/Schema';
import { eq, or } from 'drizzle-orm';
import { headers } from 'next/headers';

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

  return { proposal, recipientInfo };
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

