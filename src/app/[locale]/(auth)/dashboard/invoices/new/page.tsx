import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { createInvoice } from '../actions';
import { getClients } from '../../clients/actions';
import { getProjects } from '../../projects/actions';
import { InvoiceFormWrapper } from '@/components/forms/InvoiceFormWrapper';

interface NewInvoicePageProps {
  params: { locale: string };
  searchParams: Promise<{ clientId?: string; projectId?: string }>;
}

const NewInvoicePage = async ({ searchParams }: NewInvoicePageProps) => {
  const params = await searchParams;
  const [clients, projects] = await Promise.all([
    getClients(),
    getProjects(),
  ]);

  async function handleCreate(data: any) {
    'use server';
    const invoiceData: any = {
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
    const result = await createInvoice(invoiceData);
    redirect(`/dashboard/invoices/${result.invoice.id}`);
  }

  // Generate invoice number (simple increment, in production use proper sequence)
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

  return (
    <>
      <TitleBar title="Create New Invoice" description="Create a new invoice" />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/invoices">
          <Button variant="outline">← Back to Invoices</Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="rounded-lg border bg-card p-6">
          <InvoiceFormWrapper
            defaultValues={{
              invoiceNumber,
              clientId: params.clientId ? Number(params.clientId) : undefined,
              projectId: params.projectId
                ? Number(params.projectId)
                : undefined,
            }}
            clients={clients}
            projects={projects}
            onSubmit={handleCreate}
          />
        </div>
      </div>
    </>
  );
};

export default NewInvoicePage;

