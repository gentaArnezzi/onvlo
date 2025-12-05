import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getProjectById, updateProject, deleteProject } from '../actions';
import { getTasksByProject } from '../../tasks/actions';
import { getClientById } from '../../clients/actions';
import { ProjectFormWrapper } from '@/components/forms/ProjectFormWrapper';
import { getClients } from '../../clients/actions';
import { getProjectFiles, deleteProjectFile } from './actions';
import { FileUpload } from '@/components/files/FileUpload';
import { FileList } from '@/components/files/FileList';

interface ProjectDetailPageProps {
  params: { id: string; locale: string };
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const projectId = Number(params.id);
  if (isNaN(projectId)) {
    notFound();
  }

  const project = await getProjectById(projectId);
  if (!project) {
    notFound();
  }

  const [client, tasks, files] = await Promise.all([
    getClientById(project.clientId),
    getTasksByProject(projectId),
    getProjectFiles(projectId),
  ]);

  const clients = await getClients();

  async function handleUpdate(data: any) {
    'use server';
    const updateData: any = {
      ...data,
      clientId: Number(data.clientId),
      budget: data.budget ? Number(data.budget) : null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    };
    await updateProject(projectId, updateData);
    redirect(`/dashboard/projects/${projectId}`);
  }

  async function handleDelete() {
    'use server';
    await deleteProject(projectId);
    redirect('/dashboard/projects');
  }

  async function handleDeleteFile(fileId: number) {
    'use server';
    await deleteProjectFile(fileId);
    redirect(`/dashboard/projects/${projectId}`);
  }

  return (
    <>
      <TitleBar
        title={`Project: ${project.title}`}
        description="View and manage project details"
      />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/projects">
          <Button variant="outline">← Back to Projects</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Project Information</h2>
          <ProjectFormWrapper
            defaultValues={{
              clientId: project.clientId,
              title: project.title,
              description: project.description || '',
              status: project.status as any,
              startDate: project.startDate
                ? new Date(project.startDate).toISOString().split('T')[0]
                : '',
              endDate: project.endDate
                ? new Date(project.endDate).toISOString().split('T')[0]
                : '',
              budget: project.budget?.toString() || '',
              ownerId: project.ownerId || '',
            }}
            clients={clients}
            onSubmit={handleUpdate}
            cancelUrl={`/dashboard/projects/${projectId}`}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Client</h3>
            {client && (
              <Link
                href={`/dashboard/clients/${client.id}`}
                className="text-primary hover:underline"
              >
                {client.name}
              </Link>
            )}
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Tasks</h3>
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks yet</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <Link
                      href={`/dashboard/tasks/${task.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {task.title}
                    </Link>
                    <span className="ml-2 rounded-full bg-muted px-2 py-1 text-xs">
                      {task.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link href={`/dashboard/tasks/new?projectId=${projectId}`}>
              <Button variant="outline" className="mt-4 w-full">
                Create New Task
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Actions</h3>
            <form action={handleDelete}>
              <Button type="submit" variant="destructive" className="w-full">
                Delete Project
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
                    {project.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Budget</dt>
                <dd className="mt-1 text-sm">
                  {project.budget ? `$${project.budget.toLocaleString()}` : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="mt-1 text-sm">
                  {new Date(project.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Files Section */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Files</h3>
            <div className="space-y-4">
              <FileUpload
                projectId={projectId}
                onUploadComplete={() => redirect(`/dashboard/projects/${projectId}`)}
              />
              <FileList
                files={files.map((f) => ({
                  ...f,
                  createdAt: new Date(f.createdAt),
                }))}
                canDelete
                onDelete={handleDeleteFile}
                onRefresh={() => redirect(`/dashboard/projects/${projectId}`)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailPage;

