'use server';

import { db } from '@/libs/DB';
import { onboardingFunnelsSchema, organizationSchema } from '@/models/Schema';
import { requireAuth } from '@/utils/permissions';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const createFunnelSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  isActive: z.boolean().default(true),
  agreementTemplate: z.string().optional().nullable(),
  autoCreateProject: z.boolean().default(false),
  projectTemplate: z.string().optional().nullable(),
  formFields: z.any().optional(), // Array of form fields
});

export async function getOrganization() {
  const { orgId } = await requireAuth();

  const [org] = await db
    .select()
    .from(organizationSchema)
    .where(eq(organizationSchema.id, orgId))
    .limit(1);

  return org;
}

export async function createFunnel(data: z.infer<typeof createFunnelSchema>) {
  const { orgId } = await requireAuth();
  const validated = createFunnelSchema.parse(data);

  // Build config object
  const config: any = {};
  if (validated.agreementTemplate) {
    config.agreementTemplate = validated.agreementTemplate;
  }
  if (validated.formFields) {
    config.formFields = validated.formFields;
  }
  if (validated.autoCreateProject) {
    config.autoCreateProject = validated.autoCreateProject;
    config.projectTemplate = validated.projectTemplate;
  }

  const [funnel] = await db
    .insert(onboardingFunnelsSchema)
    .values({
      name: validated.name,
      slug: validated.slug,
      isActive: validated.isActive,
      config: Object.keys(config).length > 0 ? config : null,
      organizationId: orgId,
    })
    .returning();

  return funnel;
}

export async function getFunnels() {
  const { orgId } = await requireAuth();

  const funnels = await db
    .select()
    .from(onboardingFunnelsSchema)
    .where(eq(onboardingFunnelsSchema.organizationId, orgId))
    .orderBy(onboardingFunnelsSchema.createdAt);

  return funnels;
}

export async function getFunnelById(id: number) {
  const { orgId } = await requireAuth();

  const [funnel] = await db
    .select()
    .from(onboardingFunnelsSchema)
    .where(
      and(
        eq(onboardingFunnelsSchema.id, id),
        eq(onboardingFunnelsSchema.organizationId, orgId),
      ),
    )
    .limit(1);

  return funnel;
}

export async function getFunnelBySlug(slug: string, orgSlug: string) {
  // Get organization by slug first
  const [org] = await db
    .select()
    .from(organizationSchema)
    .where(eq(organizationSchema.slug, orgSlug))
    .limit(1);

  if (!org) {
    return null;
  }

  const [funnel] = await db
    .select()
    .from(onboardingFunnelsSchema)
    .where(
      and(
        eq(onboardingFunnelsSchema.slug, slug),
        eq(onboardingFunnelsSchema.organizationId, org.id),
        eq(onboardingFunnelsSchema.isActive, true),
      ),
    )
    .limit(1);

  return funnel;
}

export async function updateFunnel(
  id: number,
  data: Partial<z.infer<typeof createFunnelSchema>>,
) {
  const { orgId } = await requireAuth();

  const updateData: any = {};

  // Build config object from individual fields
  const config: any = {};
  if (data.agreementTemplate !== undefined) {
    config.agreementTemplate = data.agreementTemplate;
  }
  if (data.formFields !== undefined) {
    config.formFields = data.formFields;
  }
  if (data.autoCreateProject !== undefined) {
    config.autoCreateProject = data.autoCreateProject;
    config.projectTemplate = data.projectTemplate;
  }

  if (Object.keys(config).length > 0) {
    updateData.config = config;
  }

  // Update basic fields
  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const [funnel] = await db
    .update(onboardingFunnelsSchema)
    .set(updateData)
    .where(
      and(
        eq(onboardingFunnelsSchema.id, id),
        eq(onboardingFunnelsSchema.organizationId, orgId),
      ),
    )
    .returning();

  return funnel;
}

export async function deleteFunnel(id: number) {
  const { orgId } = await requireAuth();

  await db
    .delete(onboardingFunnelsSchema)
    .where(
      and(
        eq(onboardingFunnelsSchema.id, id),
        eq(onboardingFunnelsSchema.organizationId, orgId),
      ),
    );
}
