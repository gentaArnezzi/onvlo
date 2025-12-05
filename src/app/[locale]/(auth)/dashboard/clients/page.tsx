import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getClients } from './actions';

const ClientsPage = async () => {
  const clients = await getClients();

  return (
    <>
      <TitleBar title="Clients" description="Manage your clients" />

      <div className="mt-6 flex justify-between">
        <div />
        <Link href="/dashboard/clients/new">
          <Button>Create Client</Button>
        </Link>
      </div>

      <div className="mt-6">
        {clients.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">No clients yet</p>
            <Link href="/dashboard/clients/new">
              <Button className="mt-4" variant="outline">
                Create your first client
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b">
                    <td className="px-4 py-3">{client.name}</td>
                    <td className="px-4 py-3">{client.email || '-'}</td>
                    <td className="px-4 py-3">{client.company || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/clients/${client.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/clients/${client.id}`} className="ml-2">
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

export default ClientsPage;

