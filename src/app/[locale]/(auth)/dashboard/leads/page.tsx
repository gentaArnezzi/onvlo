import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';

import { getLeads } from './actions';

const LeadsPage = async () => {
  const leads = await getLeads();

  return (
    <>
      <TitleBar
        title="Leads"
        description="Manage your leads and convert them to clients"
      />

      <div className="mt-6 flex justify-between">
        <Link href="/dashboard/leads/kanban">
          <Button variant="outline">Kanban View</Button>
        </Link>
        <Link href="/dashboard/leads/new">
          <Button>Create Lead</Button>
        </Link>
      </div>

      <div className="mt-6">
        {leads.length === 0
          ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">No leads yet</p>
                <Link href="/dashboard/leads/new">
                  <Button className="mt-4" variant="outline">
                    Create your first lead
                  </Button>
                </Link>
              </div>
            )
          : (
              <div className="rounded-lg border bg-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Stage</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Source</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} className="border-b">
                        <td className="px-4 py-3">{lead.name}</td>
                        <td className="px-4 py-3">{lead.email || '-'}</td>
                        <td className="px-4 py-3">{lead.company || '-'}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-muted px-2 py-1 text-xs">
                            {lead.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3">{lead.source || '-'}</td>
                        <td className="px-4 py-3">
                          <Link href={`/dashboard/leads/${lead.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/dashboard/leads/${lead.id}`} className="ml-2">
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

export default LeadsPage;
