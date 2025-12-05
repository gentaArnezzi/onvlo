import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { createLead } from '../actions';
import { LeadFormWrapper } from '@/components/forms/LeadFormWrapper';

const NewLeadPage = async () => {
  async function handleCreate(data: Parameters<typeof createLead>[0]) {
    'use server';
    const lead = await createLead(data);
    redirect(`/dashboard/leads/${lead.id}`);
  }

  return (
    <>
      <TitleBar title="Create New Lead" description="Add a new lead to your pipeline" />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/leads">
          <Button variant="outline">← Back to Leads</Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="rounded-lg border bg-card p-6">
          <LeadFormWrapper onSubmit={handleCreate} />
        </div>
      </div>
    </>
  );
};

export default NewLeadPage;
