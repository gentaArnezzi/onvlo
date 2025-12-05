'use client';

import { useRouter } from 'next/navigation';
import { InvoiceForm, type InvoiceFormData } from './InvoiceForm';

interface InvoiceFormWrapperProps {
  defaultValues?: Partial<InvoiceFormData>;
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  cancelUrl?: string;
  isLoading?: boolean;
  clients?: Array<{ id: number; name: string }>;
  projects?: Array<{ id: number; title: string }>;
}

export function InvoiceFormWrapper({
  defaultValues,
  onSubmit,
  cancelUrl = '/dashboard/invoices',
  isLoading = false,
  clients = [],
  projects = [],
}: InvoiceFormWrapperProps) {
  const router = useRouter();

  const handleCancel = () => {
    router.push(cancelUrl);
  };

  return (
    <InvoiceForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      clients={clients}
      projects={projects}
    />
  );
}

