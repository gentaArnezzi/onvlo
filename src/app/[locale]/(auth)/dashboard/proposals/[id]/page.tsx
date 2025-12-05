import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import {
  getProposalById,
  updateProposal,
  getProposalTemplates,
} from '../actions';
import { getClients } from '../../clients/actions';
import { getLeads } from '../../leads/actions';
import { ProposalFormWrapper } from '@/components/forms/ProposalFormWrapper';
import { CopyLinkButton } from '@/components/CopyLinkButton';

interface ProposalDetailPageProps {
  params: { id: string; locale: string };
}

const ProposalDetailPage = async ({ params }: ProposalDetailPageProps) => {
  const proposalId = Number(params.id);
  if (isNaN(proposalId)) {
    notFound();
  }

  const proposal = await getProposalById(proposalId);
  if (!proposal) {
    notFound();
  }

  const [clients, leads, templates] = await Promise.all([
    getClients(),
    getLeads(),
    getProposalTemplates(),
  ]);

  async function handleUpdate(data: any) {
    'use server';
    const updateData: any = {
      ...data,
      templateId: data.templateId ? Number(data.templateId) : null,
      clientId: data.clientId ? Number(data.clientId) : null,
      leadId: data.leadId ? Number(data.leadId) : null,
    };
    await updateProposal(proposalId, updateData);
    redirect(`/dashboard/proposals/${proposalId}`);
  }

  // Generate public link (in production, use proper URL structure)
  const publicLink = `/proposals/${proposalId}`;

  return (
    <>
      <TitleBar
        title="Proposal Details"
        description="View and manage proposal"
      />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/proposals">
          <Button variant="outline">← Back to Proposals</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Proposal Information</h2>
          <ProposalFormWrapper
            defaultValues={{
              templateId: proposal.templateId || undefined,
              clientId: proposal.clientId || undefined,
              leadId: proposal.leadId || undefined,
              content: proposal.content,
              status: proposal.status as any,
            }}
            clients={clients}
            leads={leads}
            templates={templates}
            onSubmit={handleUpdate}
            cancelUrl={`/dashboard/proposals/${proposalId}`}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Status</h3>
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                proposal.status === 'Accepted'
                  ? 'bg-green-100 text-green-800'
                  : proposal.status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-muted'
              }`}
            >
              {proposal.status}
            </span>
          </div>

          {proposal.signedAt && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Signature Details</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Signed By
                  </dt>
                  <dd className="mt-1 text-sm">{proposal.signedBy}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Signed At
                  </dt>
                  <dd className="mt-1 text-sm">
                    {new Date(proposal.signedAt).toLocaleString()}
                  </dd>
                </div>
                {proposal.signedIp && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      IP Address
                    </dt>
                    <dd className="mt-1 text-sm">{proposal.signedIp}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Public Link</h3>
            <div className="space-y-2">
              <input
                type="text"
                readOnly
                value={publicLink}
                className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm"
              />
              <CopyLinkButton url={publicLink} />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Details</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Created
                </dt>
                <dd className="mt-1 text-sm">
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm">
                  {new Date(proposal.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposalDetailPage;

