import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { createProject } from '../actions';
import { getClients } from '../../clients/actions';
import { ProjectFormWrapper } from '@/components/forms/ProjectFormWrapper';

interface NewProjectPageProps {
  params: { locale: string };
  searchParams: Promise<{ clientId?: string }>;
}

const NewProjectPage = async ({ searchParams }: NewProjectPageProps) => {
  const params = await searchParams;
  const clients = await getClients();

  async function handleCreate(data: any) {
    'use server';
    const projectData: any = {
      ...data,
      clientId: Number(data.clientId),
      budget: data.budget ? Number(data.budget) : null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    };
    const project = await createProject(projectData);
    redirect(`/dashboard/projects/${project.id}`);
  }

  return (
    <>
      <TitleBar title="Create New Project" description="Add a new project" />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/projects">
          <Button variant="outline">← Back to Projects</Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="rounded-lg border bg-card p-6">
          <ProjectFormWrapper
            defaultValues={
              params.clientId ? { clientId: Number(params.clientId) } : undefined
            }
            clients={clients}
            onSubmit={handleCreate}
          />
        </div>
      </div>
    </>
  );
};

export default NewProjectPage;

