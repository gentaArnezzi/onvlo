'use client';

import { useRouter } from 'next/navigation';
import { ClientForm, type ClientFormData } from './ClientForm';

interface ClientFormWrapperProps {
  defaultValues?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => Promise<void>;
  cancelUrl?: string;
  isLoading?: boolean;
}

export function ClientFormWrapper({
  defaultValues,
  onSubmit,
  cancelUrl = '/dashboard/clients',
  isLoading = false,
}: ClientFormWrapperProps) {
  const router = useRouter();

  const handleCancel = () => {
    router.push(cancelUrl);
  };

  const handleSubmit = async (data: ClientFormData) => {
    // Convert empty strings and null to undefined for server action
    const sanitizedData: any = {
      name: data.name,
      status: data.status,
      email: data.email || undefined,
      phone: data.phone || undefined,
      company: data.company || undefined,
      notes: data.notes || undefined,
    };
    await onSubmit(sanitizedData);
  };

  return (
    <ClientForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}

