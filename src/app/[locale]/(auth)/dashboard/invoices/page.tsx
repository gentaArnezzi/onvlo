import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getInvoices } from './actions';

const InvoicesPage = async () => {
  const invoices = await getInvoices();

  return (
    <>
      <TitleBar title="Invoices" description="Manage your invoices" />

      <div className="mt-6 flex justify-between">
        <div />
        <Link href="/dashboard/invoices/new">
          <Button>Create Invoice</Button>
        </Link>
      </div>

      <div className="mt-6">
        {invoices.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">No invoices yet</p>
            <Link href="/dashboard/invoices/new">
              <Button className="mt-4" variant="outline">
                Create your first invoice
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Invoice #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="px-4 py-3">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      ${invoice.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/invoices/${invoice.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/invoices/${invoice.id}`} className="ml-2">
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

export default InvoicesPage;

