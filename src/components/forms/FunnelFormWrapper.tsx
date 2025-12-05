'use client';

import { useRouter } from 'next/navigation';
import { FunnelForm, type FunnelFormData } from './FunnelForm';

interface FunnelFormWrapperProps {
  defaultValues?: Partial<FunnelFormData>;
  onSubmit: (data: FunnelFormData) => Promise<void>;
  cancelUrl?: string;
  isLoading?: boolean;
  organizationSlug?: string;
}

export function FunnelFormWrapper({
  defaultValues,
  onSubmit,
  cancelUrl = '/dashboard/onboarding-funnels',
  isLoading = false,
  organizationSlug = '',
}: FunnelFormWrapperProps) {
  const router = useRouter();

  const handleCancel = () => {
    router.push(cancelUrl);
  };

  return (
    <FunnelForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      organizationSlug={organizationSlug}
    />
  );
}

