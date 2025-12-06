'use server';

import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { db } from '@/libs/DB';
import {
  clientsSchema,
  onboardingFunnelsSchema,
  onboardingSubmissionsSchema,
  organizationSchema,
  projectsSchema,
} from '@/models/Schema';

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
    clientId: client?.id ?? null,
    responses: data,
    status: 'completed',
  }).returning();

  // Only proceed with further steps if client was created successfully
  if (!client) {
    throw new Error('Failed to create client');
  }

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
      description: `Project created from onboarding funnel: ${funnel.name}`,
      status: 'Planned',
      ownerId: null, // Will be assigned later by agency
    });
  }

  // Send email notifications (non-blocking - use Promise.allSettled to not block redirect)
  try {
    const { sendOnboardingConfirmationEmail } = await import('@/utils/email');

    const emailPromises = [];

    // Send welcome email to client
    if (client.email) {
      emailPromises.push(
        sendOnboardingConfirmationEmail({
          clientEmail: client.email,
          clientName: client.name,
          organizationName: org.name || 'FlowStack Pro',
        }),
      );
    }

    // Send notification to organization owner
    // TODO: Fetch organization owner email from Clerk and send notification

    // Execute all email sends in parallel (non-blocking)
    await Promise.allSettled(emailPromises);
  } catch (error) {
    // Log email errors but don't block the flow
    console.error('[Onboarding] Email notification error:', error);
  }

  redirect(`/onboard/${orgSlug}/${funnelSlug}/success`);
}
