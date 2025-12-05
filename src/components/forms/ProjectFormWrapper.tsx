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

  const handleSubmit = async (data: ProjectFormData) => {
    // Convert form data to server action compatible format
    const sanitizedData: any = {
      clientId: data.clientId,
      title: data.title,
      description: data.description || undefined,
      status: data.status,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      budget: data.budget ? parseFloat(data.budget) : undefined,
      ownerId: data.ownerId || undefined,
    };
    await onSubmit(sanitizedData);
  };

  return (
    <ProjectForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      clients={clients}
    />
  );
}

