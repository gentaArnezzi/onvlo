import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getClientPortalData } from './actions';

const ClientPortalPage = async () => {
  let data;
  try {
    data = await getClientPortalData();
  } catch (error) {
    // If client not found, redirect to sign-in
    redirect('/sign-in');
  }

  const { client, projects, invoices } = data;

  const activeProjects = projects.filter((p) => p.status === 'active');
  const pendingInvoices = invoices.filter(
    (inv) => inv.status === 'Sent' || inv.status === 'Overdue',
  );

  return (
    <>
      <TitleBar
        title={`Welcome, ${client.name}`}
        description="View your projects and invoices"
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-2xl font-bold">{activeProjects.length}</h3>
          <p className="text-sm text-muted-foreground">Active Projects</p>
          <Link href="/client/projects" className="mt-4 block">
            <Button variant="outline" size="sm" className="w-full">
              View All Projects
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-2xl font-bold">{pendingInvoices.length}</h3>
          <p className="text-sm text-muted-foreground">Pending Invoices</p>
          <Link href="/client/invoices" className="mt-4 block">
            <Button variant="outline" size="sm" className="w-full">
              View All Invoices
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-2xl font-bold">
            ${invoices
              .filter((inv) => inv.status === 'Paid')
              .reduce((sum, inv) => sum + Number(inv.total), 0)
              .toFixed(2)}
          </h3>
          <p className="text-sm text-muted-foreground">Total Paid</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Projects</h3>
          {activeProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active projects</p>
          ) : (
            <div className="space-y-3">
              {activeProjects.slice(0, 3).map((project) => (
                <Link
                  key={project.id}
                  href={`/client/projects/${project.id}`}
                  className="block rounded-md border p-3 transition-colors hover:bg-muted"
                >
                  <div className="font-medium">{project.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {project.status}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Invoices</h3>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices yet</p>
          ) : (
            <div className="space-y-3">
              {invoices.slice(0, 3).map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/client/invoices/${invoice.id}`}
                  className="block rounded-md border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{invoice.invoiceNumber}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        ${invoice.total.toFixed(2)}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        invoice.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'Overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-muted'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientPortalPage;
