import { redirect } from 'next/navigation';

import { TitleBar } from '@/features/dashboard/TitleBar';
import {
  getOrganizationSettings,
  updateOrganizationSettings,
} from './actions';
import { AgencyProfileForm } from '@/components/settings/AgencyProfileForm';
import { BrandingForm } from '@/components/settings/BrandingForm';
import { BillingForm } from '@/components/settings/BillingForm';

const SettingsPage = async () => {
  const org = await getOrganizationSettings();

  if (!org) {
    redirect('/dashboard');
  }

  async function handleUpdateProfile(data: any) {
    'use server';
    await updateOrganizationSettings(data);
    redirect('/dashboard/settings');
  }

  async function handleUpdateBranding(data: any) {
    'use server';
    await updateOrganizationSettings(data);
    redirect('/dashboard/settings');
  }

  async function handleUpdateBilling(data: any) {
    'use server';
    await updateOrganizationSettings(data);
    redirect('/dashboard/settings');
  }

  return (
    <>
      <TitleBar
        title="Settings"
        description="Manage your agency settings"
      />

      <div className="mt-6 space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Agency Profile</h2>
          <AgencyProfileForm
            defaultValues={{
              name: org.name || '',
              slug: org.slug || '',
              logo: org.logo || '',
            }}
            onSubmit={handleUpdateProfile}
          />
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Branding</h2>
          <BrandingForm
            defaultValues={{
              brandColor: org.brandColor || '#000000',
            }}
            onSubmit={handleUpdateBranding}
          />
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Billing & Preferences</h2>
          <BillingForm
            defaultValues={{
              timezone: org.timezone || 'UTC',
              defaultCurrency: org.defaultCurrency || 'USD',
              defaultInvoiceTerms: org.defaultInvoiceTerms || 'Net 30',
            }}
            onSubmit={handleUpdateBilling}
          />
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Integrations</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Stripe</h3>
              <p className="text-sm text-muted-foreground">
                Stripe keys are configured via environment variables. Contact your
                administrator to update them.
              </p>
              <div className="mt-2 rounded-md bg-muted p-3">
                <div className="text-xs font-mono text-muted-foreground">
                  STRIPE_SECRET_KEY: {process.env.STRIPE_SECRET_KEY ? '✓ Configured' : '✗ Not configured'}
                </div>
                <div className="mt-1 text-xs font-mono text-muted-foreground">
                  STRIPE_WEBHOOK_SECRET: {process.env.STRIPE_WEBHOOK_SECRET ? '✓ Configured' : '✗ Not configured'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;

