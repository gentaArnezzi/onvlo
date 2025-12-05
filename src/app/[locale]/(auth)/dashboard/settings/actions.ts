'use server';

import { db } from '@/libs/DB';
import { organizationSchema } from '@/models/Schema';
import { requireAuth } from '@/utils/permissions';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const updateOrganizationSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  logo: z.string().optional().nullable(),
  brandColor: z.string().optional().nullable(),
  timezone: z.string().optional(),
  defaultCurrency: z.string().optional(),
  defaultInvoiceTerms: z.string().optional(),
});

export async function getOrganizationSettings() {
  const { orgId } = await requireAuth();

  const [org] = await db
    .select()
    .from(organizationSchema)
    .where(eq(organizationSchema.id, orgId))
    .limit(1);

  return org;
}

export async function updateOrganizationSettings(
  data: Partial<z.infer<typeof updateOrganizationSchema>>,
) {
  const { orgId } = await requireAuth();
  const validated = updateOrganizationSchema.parse(data);

  const [org] = await db
    .update(organizationSchema)
    .set(validated)
    .where(eq(organizationSchema.id, orgId))
    .returning();

  return org;
}

