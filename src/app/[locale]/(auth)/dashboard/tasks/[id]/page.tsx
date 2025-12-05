import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getTaskById, updateTask, deleteTask } from '../actions';
import { getProjectById } from '../../projects/actions';
import { TaskFormWrapper } from '@/components/forms/TaskFormWrapper';
import { getProjects } from '../../projects/actions';

interface TaskDetailPageProps {
  params: { id: string; locale: string };
}

const TaskDetailPage = async ({ params }: TaskDetailPageProps) => {
  const taskId = Number(params.id);
  if (isNaN(taskId)) {
    notFound();
  }

  const task = await getTaskById(taskId);
  if (!task) {
    notFound();
  }

  const project = await getProjectById(task.projectId);
  const projects = await getProjects();

  async function handleUpdate(data: any) {
    'use server';
    const updateData: any = {
      ...data,
      projectId: Number(data.projectId),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    };
    await updateTask(taskId, updateData);
    redirect(`/dashboard/tasks/${taskId}`);
  }

  async function handleDelete() {
    'use server';
    await deleteTask(taskId);
    redirect('/dashboard/tasks');
  }

  return (
    <>
      <TitleBar
        title={`Task: ${task.title}`}
        description="View and manage task details"
      />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/tasks">
          <Button variant="outline">← Back to Tasks</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Task Information</h2>
          <TaskFormWrapper
            defaultValues={{
              projectId: task.projectId,
              title: task.title,
              description: task.description || '',
              assigneeId: task.assigneeId || '',
              status: task.status as any,
              priority: (task.priority as any) || 'Medium',
              dueDate: task.dueDate
                ? new Date(task.dueDate).toISOString().split('T')[0]
                : '',
              visibleToClient: task.visibleToClient,
              labels: task.labels || '',
            }}
            projects={projects}
            onSubmit={handleUpdate}
            cancelUrl={`/dashboard/tasks/${taskId}`}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Project</h3>
            {project && (
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="text-primary hover:underline"
              >
                {project.title}
              </Link>
            )}
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Actions</h3>
            <form action={handleDelete}>
              <Button type="submit" variant="destructive" className="w-full">
                Delete Task
              </Button>
            </form>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Details</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">
                    {task.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Priority</dt>
                <dd className="mt-1 text-sm">{task.priority || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Due Date</dt>
                <dd className="mt-1 text-sm">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Visible to Client
                </dt>
                <dd className="mt-1 text-sm">
                  {task.visibleToClient ? 'Yes' : 'No'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="mt-1 text-sm">
                  {new Date(task.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailPage;

