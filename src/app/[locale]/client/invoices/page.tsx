import Link from 'next/link';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { getClientPortalData } from '../actions';

const ClientInvoicesPage = async () => {
  const data = await getClientPortalData();
  const { invoices } = data;

  return (
    <>
      <TitleBar
        title="My Invoices"
        description="View and pay your invoices"
      />

      <div className="mt-6">
        {invoices.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">No invoices yet</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Invoice Number
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="px-4 py-3 font-medium">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ${invoice.total.toFixed(2)}
                    </td>
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
                      <Link href={`/client/invoices/${invoice.id}`}>
                        <button className="text-sm text-primary hover:underline">
                          View
                        </button>
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

export default ClientInvoicesPage;
