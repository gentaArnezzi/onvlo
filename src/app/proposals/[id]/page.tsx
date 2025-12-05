import { notFound, redirect } from 'next/navigation';
import { getPublicProposal, signProposal } from './actions';
import { SignatureForm } from '@/components/proposals/SignatureForm';

interface PublicProposalPageProps {
  params: { id: string };
}

const PublicProposalPage = async ({ params }: PublicProposalPageProps) => {
  const proposalId = Number(params.id);
  if (isNaN(proposalId)) {
    notFound();
  }

  const data = await getPublicProposal(proposalId);
  if (!data) {
    notFound();
  }

  const { proposal, recipientInfo } = data;

  async function handleSign(signedBy: string) {
    'use server';
    await signProposal(proposalId, signedBy);
    redirect(`/proposals/${proposalId}`);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Proposal</h1>
            <div
              className={`rounded-full px-3 py-1 text-sm ${
                proposal.status === 'Accepted'
                  ? 'bg-green-100 text-green-800'
                  : proposal.status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : proposal.status === 'Sent'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-muted'
              }`}
            >
              {proposal.status}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Proposal Content */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-card p-8">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {proposal.content}
              </div>
            </div>

            {recipientInfo && (
              <div className="mt-6 rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
                  Proposal For
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">{recipientInfo.name}</span>
                  </div>
                  {recipientInfo.company && (
                    <div className="text-muted-foreground">
                      {recipientInfo.company}
                    </div>
                  )}
                  {recipientInfo.email && (
                    <div className="text-muted-foreground">
                      {recipientInfo.email}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Signature Section */}
          <div className="lg:col-span-1">
            {proposal.status === 'Sent' && (
              <SignatureForm proposalId={proposalId} onSign={handleSign} />
            )}

            {proposal.status === 'Accepted' && proposal.signedAt && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-green-800">
                  Proposal Accepted
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-muted-foreground">
                      Signed by
                    </dt>
                    <dd className="mt-1">{proposal.signedBy}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">
                      Date signed
                    </dt>
                    <dd className="mt-1">
                      {new Date(proposal.signedAt).toLocaleString()}
                    </dd>
                  </div>
                  {proposal.signedIp && (
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        IP Address
                      </dt>
                      <dd className="mt-1 font-mono text-xs">
                        {proposal.signedIp}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {proposal.status === 'Rejected' && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold text-red-800">
                  Proposal Rejected
                </h3>
              </div>
            )}

            {proposal.status === 'Draft' && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Draft Proposal
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This proposal is still in draft mode.
                </p>
              </div>
            )}

            <div className="mt-6 rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                Details
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">Created</dt>
                  <dd className="mt-1">
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">
                    Last Updated
                  </dt>
                  <dd className="mt-1">
                    {new Date(proposal.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProposalPage;

