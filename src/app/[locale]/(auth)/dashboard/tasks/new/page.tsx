import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { createTask } from '../actions';
import { getProjects } from '../../projects/actions';
import { TaskFormWrapper } from '@/components/forms/TaskFormWrapper';

interface NewTaskPageProps {
  params: { locale: string };
  searchParams: Promise<{ projectId?: string }>;
}

const NewTaskPage = async ({ searchParams }: NewTaskPageProps) => {
  const params = await searchParams;
  const projects = await getProjects();

  async function handleCreate(data: any) {
    'use server';
    const taskData: any = {
      ...data,
      projectId: Number(data.projectId),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    };
    const task = await createTask(taskData);
    redirect(`/dashboard/tasks/${task.id}`);
  }

  return (
    <>
      <TitleBar title="Create New Task" description="Add a new task" />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/tasks">
          <Button variant="outline">← Back to Tasks</Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="rounded-lg border bg-card p-6">
          <TaskFormWrapper
            defaultValues={
              params.projectId ? { projectId: Number(params.projectId) } : undefined
            }
            projects={projects}
            onSubmit={handleCreate}
          />
        </div>
      </div>
    </>
  );
};

export default NewTaskPage;

