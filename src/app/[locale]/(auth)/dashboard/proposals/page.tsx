import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getProposals } from './actions';

const ProposalsPage = async () => {
  const proposals = await getProposals();

  return (
    <>
      <TitleBar title="Proposals" description="Manage your proposals" />

      <div className="mt-6 flex justify-between">
        <div />
        <Link href="/dashboard/proposals/new">
          <Button>Create Proposal</Button>
        </Link>
      </div>

      <div className="mt-6">
        {proposals.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">No proposals yet</p>
            <Link href="/dashboard/proposals/new">
              <Button className="mt-4" variant="outline">
                Create your first proposal
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Signed</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="border-b">
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {proposal.signedAt
                        ? new Date(proposal.signedAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/proposals/${proposal.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/proposals/${proposal.id}`} className="ml-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ProposalsPage;

