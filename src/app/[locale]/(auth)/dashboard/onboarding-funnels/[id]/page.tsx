import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import {
  getFunnelById,
  updateFunnel,
  deleteFunnel,
  getOrganization,
} from '../actions';
import { FunnelFormWrapper } from '@/components/forms/FunnelFormWrapper';

interface FunnelDetailPageProps {
  params: { id: string; locale: string };
}

const FunnelDetailPage = async ({ params }: FunnelDetailPageProps) => {
  const funnelId = Number(params.id);
  if (isNaN(funnelId)) {
    notFound();
  }

  const [funnel, org] = await Promise.all([
    getFunnelById(funnelId),
    getOrganization(),
  ]);

  if (!funnel) {
    notFound();
  }

  // Extract config values
  const config = funnel.config as any || {};
  const agreementTemplate = config.agreementTemplate || '';
  const formFields = config.formFields || [];
  const autoCreateProject = config.autoCreateProject || false;
  const projectTemplate = config.projectTemplate || '';

  async function handleUpdate(data: any) {
    'use server';
    await updateFunnel(funnelId, data);
    redirect(`/dashboard/onboarding-funnels/${funnelId}`);
  }

  async function handleDelete() {
    'use server';
    await deleteFunnel(funnelId);
    redirect('/dashboard/onboarding-funnels');
  }

  const publicUrl = org?.slug && funnel.slug
    ? `/onboard/${org.slug}/${funnel.slug}`
    : '';

  return (
    <>
      <TitleBar
        title={`Funnel: ${funnel.name}`}
        description="View and manage onboarding funnel"
      />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/onboarding-funnels">
          <Button variant="outline">← Back to Funnels</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Funnel Configuration</h2>
          <FunnelFormWrapper
            defaultValues={{
              name: funnel.name,
              slug: funnel.slug,
              isActive: funnel.isActive,
              agreementTemplate,
              formFields,
              autoCreateProject,
              projectTemplate,
            }}
            organizationSlug={org?.slug || ''}
            onSubmit={handleUpdate}
            cancelUrl={`/dashboard/onboarding-funnels/${funnelId}`}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Public URL</h3>
            {publicUrl ? (
              <div className="space-y-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm"
                />
                <Link href={publicUrl} target="_blank">
                  <Button variant="outline" size="sm" className="w-full">
                    Open Public Link
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Set organization slug in settings to generate public URL
              </p>
            )}
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Status</h3>
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                funnel.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {funnel.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Actions</h3>
            <form action={handleDelete}>
              <Button type="submit" variant="destructive" className="w-full">
                Delete Funnel
              </Button>
            </form>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Details</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Created
                </dt>
                <dd className="mt-1 text-sm">
                  {new Date(funnel.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm">
                  {new Date(funnel.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default FunnelDetailPage;

