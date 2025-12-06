'use server';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/libs/DB';
import { dealsSchema } from '@/models/Schema';

export async function getDeals() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error('Unauthorized');
  }

  const deals = await db
    .select()
    .from(dealsSchema)
    .where(eq(dealsSchema.organizationId, orgId));

  return deals;
}

export async function updateDealStage(dealId: number, newStage: string) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error('Unauthorized');
  }

  await db
    .update(dealsSchema)
    .set({ stage: newStage })
    .where(eq(dealsSchema.id, dealId));

  revalidatePath('/dashboard/deals');
}
