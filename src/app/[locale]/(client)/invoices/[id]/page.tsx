import { notFound } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getClientPortalData } from '../../actions';
import { db } from '@/libs/DB';
import { invoiceItemsSchema } from '@/models/Schema';
import { eq } from 'drizzle-orm';

interface InvoiceDetailPageProps {
  params: { id: string; locale: string };
}

const ClientInvoiceDetailPage = async ({
  params,
}: InvoiceDetailPageProps) => {
  const invoiceId = Number(params.id);
  if (isNaN(invoiceId)) {
    notFound();
  }

  const data = await getClientPortalData();
  const { invoices } = data;

  const invoice = invoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    notFound();
  }

  // Get invoice items
  const items = await db
    .select()
    .from(invoiceItemsSchema)
    .where(eq(invoiceItemsSchema.invoiceId, invoiceId));

  return (
    <>
      <TitleBar
        title={`Invoice: ${invoice.invoiceNumber}`}
        description="Invoice details"
      />

      <div className="mt-6 flex gap-4">
        <Link href="/client/invoices">
          <Button variant="outline">← Back to Invoices</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Invoice Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Invoice Number
              </dt>
              <dd className="mt-1 font-medium">{invoice.invoiceNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Status
              </dt>
              <dd className="mt-1">
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
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Issue Date
              </dt>
              <dd className="mt-1 text-sm">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Due Date
              </dt>
              <dd className="mt-1 text-sm">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </dd>
            </div>
            {invoice.notes && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Notes
                </dt>
                <dd className="mt-1 text-sm">{invoice.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Line Items</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <div className="font-medium">{item.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </div>
                </div>
                <div className="font-medium">
                  ${item.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Tax ({invoice.taxRate}%)
                </span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
          {invoice.status !== 'Paid' && (
            <div className="mt-6">
              <Button className="w-full">Pay Invoice</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientInvoiceDetailPage;

