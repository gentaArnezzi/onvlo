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

  return (
    <ClientForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}

