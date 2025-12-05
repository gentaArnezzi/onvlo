import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import {
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  sendInvoice,
} from '../actions';
import { createPaymentLink } from '../stripe-actions';
import { InvoiceFormWrapper } from '@/components/forms/InvoiceFormWrapper';
import { getClients } from '../../clients/actions';
import { getProjects } from '../../projects/actions';
import { InvoiceDownloadButton } from '@/components/invoices/InvoiceDownloadButton';
import { db } from '@/libs/DB';
import { organizationSchema } from '@/models/Schema';
import { eq } from 'drizzle-orm';

interface InvoiceDetailPageProps {
  params: { id: string; locale: string };
}

const InvoiceDetailPage = async ({ params }: InvoiceDetailPageProps) => {
  const invoiceId = Number(params.id);
  if (isNaN(invoiceId)) {
    notFound();
  }

  const invoiceData = await getInvoiceById(invoiceId);
  if (!invoiceData) {
    notFound();
  }

  const { invoice, items } = invoiceData;
  const [clients, projects] = await Promise.all([
    getClients(),
    getProjects(),
  ]);

  const [organization] = await db
    .select()
    .from(organizationSchema)
    .where(eq(organizationSchema.id, invoice.organizationId))
    .limit(1);

  async function handleUpdate(data: any) {
    'use server';
    const updateData: any = {
      ...data,
      clientId: Number(data.clientId),
      projectId: data.projectId ? Number(data.projectId) : null,
      dueDate: new Date(data.dueDate),
      taxRate: Number(data.taxRate) || 0,
      items: data.items.map((item: any) => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };
    await updateInvoice(invoiceId, updateData);
    redirect(`/dashboard/invoices/${invoiceId}`);
  }

  async function handleDelete() {
    'use server';
    await deleteInvoice(invoiceId);
    redirect('/dashboard/invoices');
  }

  async function handleSend() {
    'use server';
    await sendInvoice(invoiceId);
    redirect(`/dashboard/invoices/${invoiceId}`);
  }

  async function handleGeneratePaymentLink() {
    'use server';
    const paymentUrl = await createPaymentLink(invoiceId);
    if (paymentUrl) {
      redirect(paymentUrl);
    }
  }

  return (
    <>
      <TitleBar
        title={`Invoice: ${invoice.invoiceNumber}`}
        description="View and manage invoice details"
      />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/invoices">
          <Button variant="outline">← Back to Invoices</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Invoice Information</h2>
          <InvoiceFormWrapper
            defaultValues={{
              clientId: invoice.clientId,
              projectId: invoice.projectId || undefined,
              invoiceNumber: invoice.invoiceNumber,
              dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
              taxRate: invoice.taxRate,
              notes: invoice.notes || '',
              items: items.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
            }}
            clients={clients}
            projects={projects}
            onSubmit={handleUpdate}
            cancelUrl={`/dashboard/invoices/${invoiceId}`}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Invoice Summary</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd>
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
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Subtotal</dt>
                <dd className="text-sm">${invoice.subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Tax</dt>
                <dd className="text-sm">${invoice.tax.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between font-bold">
                <dt>Total</dt>
                <dd>${invoice.total.toFixed(2)}</dd>
              </div>
              {invoice.paidAt && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Paid At
                  </dt>
                  <dd className="text-sm">
                    {new Date(invoice.paidAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Actions</h3>
            <div className="space-y-2">
              {invoice.status === 'Draft' && (
                <form action={handleSend}>
                  <Button type="submit" className="w-full">
                    Send Invoice
                  </Button>
                </form>
              )}
              {invoice.status === 'Sent' && (
                <form action={handleGeneratePaymentLink}>
                  <Button type="submit" className="w-full">
                    Generate Payment Link
                  </Button>
                </form>
              )}
              <form action={handleDelete}>
                <Button type="submit" variant="destructive" className="w-full">
                  Delete Invoice
                </Button>
              </form>
              
              <div className="pt-2 border-t">
                <InvoiceDownloadButton 
                  invoice={invoice}
                  items={items}
                  client={clients.find(c => c.id === invoice.clientId)}
                  organization={organization}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetailPage;

