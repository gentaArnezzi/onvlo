'use client';

import { useRouter } from 'next/navigation';
import { TaskForm, type TaskFormData } from './TaskForm';

interface TaskFormWrapperProps {
  defaultValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  cancelUrl?: string;
  isLoading?: boolean;
  projects?: Array<{ id: number; title: string }>;
}

export function TaskFormWrapper({
  defaultValues,
  onSubmit,
  cancelUrl = '/dashboard/tasks',
  isLoading = false,
  projects = [],
}: TaskFormWrapperProps) {
  const router = useRouter();

  const handleCancel = () => {
    router.push(cancelUrl);
  };

  return (
    <TaskForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      projects={projects}
    />
  );
}

