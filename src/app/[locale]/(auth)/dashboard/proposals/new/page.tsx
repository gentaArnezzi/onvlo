import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { createProposal, getProposalTemplates } from '../actions';
import { getClients } from '../../clients/actions';
import { getLeads } from '../../leads/actions';
import { ProposalFormWrapper } from '@/components/forms/ProposalFormWrapper';

interface NewProposalPageProps {
  params: { locale: string };
  searchParams: Promise<{ clientId?: string; leadId?: string; templateId?: string }>;
}

const NewProposalPage = async ({ searchParams }: NewProposalPageProps) => {
  const params = await searchParams;
  const [clients, leads, templates] = await Promise.all([
    getClients(),
    getLeads(),
    getProposalTemplates(),
  ]);

  async function handleCreate(data: any) {
    'use server';
    const proposalData: any = {
      ...data,
      templateId: data.templateId ? Number(data.templateId) : null,
      clientId: data.clientId ? Number(data.clientId) : null,
      leadId: data.leadId ? Number(data.leadId) : null,
    };
    const proposal = await createProposal(proposalData);
    redirect(`/dashboard/proposals/${proposal.id}`);
  }

  // If template is selected, load template content
  let defaultContent = '';
  if (params.templateId) {
    const template = templates.find(
      (t) => t.id === Number(params.templateId),
    );
    if (template) {
      defaultContent = template.content;
    }
  }

  return (
    <>
      <TitleBar title="Create New Proposal" description="Create a new proposal" />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/proposals">
          <Button variant="outline">← Back to Proposals</Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="rounded-lg border bg-card p-6">
          <ProposalFormWrapper
            defaultValues={{
              templateId: params.templateId
                ? Number(params.templateId)
                : undefined,
              clientId: params.clientId ? Number(params.clientId) : undefined,
              leadId: params.leadId ? Number(params.leadId) : undefined,
              content: defaultContent,
            }}
            clients={clients}
            leads={leads}
            templates={templates}
            onSubmit={handleCreate}
          />
        </div>
      </div>
    </>
  );
};

export default NewProposalPage;

