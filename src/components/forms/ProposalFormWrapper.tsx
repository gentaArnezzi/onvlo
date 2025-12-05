'use client';

import { useRouter } from 'next/navigation';
import { ProposalForm, type ProposalFormData } from './ProposalForm';

interface ProposalFormWrapperProps {
  defaultValues?: Partial<ProposalFormData>;
  onSubmit: (data: ProposalFormData) => Promise<void>;
  cancelUrl?: string;
  isLoading?: boolean;
  clients?: Array<{ id: number; name: string }>;
  leads?: Array<{ id: number; name: string }>;
  templates?: Array<{ id: number; name: string }>;
}

export function ProposalFormWrapper({
  defaultValues,
  onSubmit,
  cancelUrl = '/dashboard/proposals',
  isLoading = false,
  clients = [],
  leads = [],
  templates = [],
}: ProposalFormWrapperProps) {
  const router = useRouter();

  const handleCancel = () => {
    router.push(cancelUrl);
  };

  return (
    <ProposalForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      clients={clients}
      leads={leads}
      templates={templates}
    />
  );
}

