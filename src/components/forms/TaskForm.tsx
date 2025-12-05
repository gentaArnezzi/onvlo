'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const taskFormSchema = z.object({
  projectId: z.number().min(1, 'Project is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.enum(['Todo', 'In Progress', 'Review', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  dueDate: z.string().optional(),
  visibleToClient: z.boolean(),
  labels: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  defaultValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  projects?: Array<{ id: number; title: string }>;
}

export function TaskForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  projects = [],
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      status: 'Todo',
      priority: 'Medium',
      visibleToClient: false,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="projectId">Project *</Label>
        <select
          id="projectId"
          {...register('projectId', { valueAsNumber: true })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
        {errors.projectId && (
          <p className="mt-1 text-sm text-red-500">{errors.projectId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register('title')}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            {...register('status')}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            {...register('priority')}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          {...register('dueDate')}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="visibleToClient"
          {...register('visibleToClient')}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="visibleToClient" className="cursor-pointer">
          Visible to Client
        </Label>
      </div>

      <div>
        <Label htmlFor="labels">Labels</Label>
        <Input
          id="labels"
          placeholder="Comma-separated labels"
          {...register('labels')}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

