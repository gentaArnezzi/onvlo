'use server';

import { db } from '@/libs/DB';
import {
  clientsSchema,
  onboardingFunnelsSchema,
  onboardingSubmissionsSchema,
  organizationSchema,
  projectsSchema,
} from '@/models/Schema';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function submitOnboardingData(
  orgSlug: string,
  funnelSlug: string,
  data: Record<string, any>,
) {
  // Get organization by slug
  const [org] = await db
    .select()
    .from(organizationSchema)
    .where(eq(organizationSchema.slug, orgSlug))
    .limit(1);

  if (!org) {
    throw new Error('Organization not found');
  }

  // Get funnel
  const [funnel] = await db
    .select()
    .from(onboardingFunnelsSchema)
    .where(
      and(
        eq(onboardingFunnelsSchema.slug, funnelSlug),
        eq(onboardingFunnelsSchema.organizationId, org.id),
        eq(onboardingFunnelsSchema.isActive, true),
      ),
    )
    .limit(1);

  if (!funnel) {
    throw new Error('Funnel not found or inactive');
  }

  // Extract basic info (try to get from custom fields or fallback)
  const name = data.name || data.full_name || '';
  const email = data.email || '';
  const phone = data.phone || '';
  const company = data.company || '';

  // Create client
  const [client] = await db
    .insert(clientsSchema)
    .values({
      organizationId: org.id,
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      status: 'active',
    })
    .returning();

  // Create onboarding submission
  await db.insert(onboardingSubmissionsSchema).values({
    funnelId: funnel.id,
    clientId: client.id,
    responses: data,
    status: 'completed',
  });

  // Auto-create project if configured
  const config = funnel.config as any || {};
  if (config.autoCreateProject && config.projectTemplate) {
    let projectTitle = config.projectTemplate;

    // Replace placeholders
    projectTitle = projectTitle.replace(/\{\{client_name\}\}/g, name);
    projectTitle = projectTitle.replace(/\{\{company\}\}/g, company);

    await db.insert(projectsSchema).values({
      organizationId: org.id,
      clientId: client.id,
      title: projectTitle,
      status: 'planned',
      ownerId: null, // Will be assigned later by agency
    });
  }

  redirect(`/onboard/${orgSlug}/${funnelSlug}/success`);
}

