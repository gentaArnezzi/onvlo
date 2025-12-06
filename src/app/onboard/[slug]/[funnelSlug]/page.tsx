import { and, eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import {
  onboardingFunnelsSchema,
  organizationSchema,
} from '@/models/Schema';

import { submitOnboardingData } from './actions';
import { OnboardingClient } from './OnboardingClient';

const OnboardingPage = async ({
  params,
}: {
  params: { slug: string; funnelSlug: string };
}) => {
  // Get organization by slug
  const [org] = await db
    .select()
    .from(organizationSchema)
    .where(eq(organizationSchema.slug, params.slug))
    .limit(1);

  if (!org) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold">Organization not found</h1>
        </div>
      </div>
    );
  }

  // Get funnel
  const [funnel] = await db
    .select()
    .from(onboardingFunnelsSchema)
    .where(
      and(
        eq(onboardingFunnelsSchema.slug, params.funnelSlug),
        eq(onboardingFunnelsSchema.organizationId, org.id),
        eq(onboardingFunnelsSchema.isActive, true),
      ),
    )
    .limit(1);

  if (!funnel) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold">Funnel not found or inactive</h1>
        </div>
      </div>
    );
  }

  // Extract config values
  const config = funnel.config as any || {};
  const agreementTemplate = config.agreementTemplate || '';
  const formFields = config.formFields || [];

  async function handleSubmit(data: any) {
    'use server';
    await submitOnboardingData(params.slug, params.funnelSlug, data);
  }

  return (
    <OnboardingClient
      organizationName={org.name || 'Our Agency'}
      formFields={formFields}
      agreementTemplate={agreementTemplate}
      onSubmit={handleSubmit}
    />
  );
};

export default OnboardingPage;
