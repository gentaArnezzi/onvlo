'use client';

import { useRouter } from 'next/navigation';
import { ProjectForm, type ProjectFormData } from './ProjectForm';

interface ProjectFormWrapperProps {
  defaultValues?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  cancelUrl?: string;
  isLoading?: boolean;
  clients?: Array<{ id: number; name: string }>;
}

export function ProjectFormWrapper({
  defaultValues,
  onSubmit,
  cancelUrl = '/dashboard/projects',
  isLoading = false,
  clients = [],
}: ProjectFormWrapperProps) {
  const router = useRouter();

  const handleCancel = () => {
    router.push(cancelUrl);
  };

  return (
    <ProjectForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      clients={clients}
    />
  );
}

