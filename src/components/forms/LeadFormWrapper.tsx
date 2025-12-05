'use client';

import { useRouter } from 'next/navigation';
import { LeadForm, type LeadFormData } from './LeadForm';

interface LeadFormWrapperProps {
  defaultValues?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  cancelUrl?: string;
  isLoading?: boolean;
}

export function LeadFormWrapper({
  defaultValues,
  onSubmit,
  cancelUrl = '/dashboard/leads',
  isLoading = false,
}: LeadFormWrapperProps) {
  const router = useRouter();

  const handleCancel = () => {
    router.push(cancelUrl);
  };

  return (
    <LeadForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}

