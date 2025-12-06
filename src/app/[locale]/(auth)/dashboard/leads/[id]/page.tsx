import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { LeadFormWrapper } from '@/components/forms/LeadFormWrapper';
import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';

import { convertLeadToClient, deleteLead, getLeadById, updateLead } from '../actions';

type LeadDetailPageProps = {
  params: { id: string; locale: string };
};

const LeadDetailPage = async ({ params }: LeadDetailPageProps) => {
  const leadId = Number(params.id);
  if (Number.isNaN(leadId)) {
    notFound();
  }

  const lead = await getLeadById(leadId);
  if (!lead) {
    notFound();
  }

  async function handleDelete() {
    'use server';
    await deleteLead(leadId);
    redirect('/dashboard/leads');
  }

  async function handleConvertToClient() {
    'use server';
    await convertLeadToClient(leadId);
    redirect('/dashboard/clients');
  }

  return (
    <>
      <TitleBar
        title={`Lead: ${lead.name}`}
        description="View and manage lead details"
      />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/leads">
          <Button variant="outline">← Back to Leads</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Lead Information</h2>
          <LeadFormWrapper
            defaultValues={{
              name: lead.name,
              email: lead.email || '',
              phone: lead.phone || '',
              company: lead.company || '',
              source: lead.source || '',
              stage: lead.stage as any,
              notes: lead.notes || '',
            }}
            onSubmit={async (data) => {
              await updateLead(leadId, data);
              redirect(`/dashboard/leads/${leadId}`);
            }}
            cancelUrl={`/dashboard/leads/${leadId}`}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Actions</h3>
            <div className="space-y-2">
              <form action={handleConvertToClient}>
                <Button type="submit" className="w-full">
                  Convert to Client
                </Button>
              </form>
              <form action={handleDelete}>
                <Button type="submit" variant="destructive" className="w-full">
                  Delete Lead
                </Button>
              </form>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Details</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Stage</dt>
                <dd className="mt-1">
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">
                    {lead.stage}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="mt-1 text-sm">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd className="mt-1 text-sm">
                  {new Date(lead.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadDetailPage;
