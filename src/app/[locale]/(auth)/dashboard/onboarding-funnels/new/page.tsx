import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { createFunnel, getOrganization } from '../actions';
import { FunnelFormWrapper } from '@/components/forms/FunnelFormWrapper';

const NewFunnelPage = async () => {
  const org = await getOrganization();

  async function handleCreate(data: any) {
    'use server';
    const funnel = await createFunnel(data);
    redirect(`/dashboard/onboarding-funnels/${funnel.id}`);
  }

  return (
    <>
      <TitleBar
        title="Create New Onboarding Funnel"
        description="Create a new client onboarding funnel"
      />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/onboarding-funnels">
          <Button variant="outline">← Back to Funnels</Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="rounded-lg border bg-card p-6">
          <FunnelFormWrapper
            organizationSlug={org?.slug || ''}
            onSubmit={handleCreate}
          />
        </div>
      </div>
    </>
  );
};

export default NewFunnelPage;

