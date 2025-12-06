import { and, eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FileList } from '@/components/files/FileList';
import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { db } from '@/libs/DB';
import { filesSchema, invoicesSchema, tasksSchema } from '@/models/Schema';

import { getClientPortalData } from '../../actions';

type ProjectDetailPageProps = {
  params: { id: string; locale: string };
};

const ClientProjectDetailPage = async ({
  params,
}: ProjectDetailPageProps) => {
  const projectId = Number(params.id);
  if (Number.isNaN(projectId)) {
    notFound();
  }

  const data = await getClientPortalData();
  const { projects } = data;

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    notFound();
  }

  // Get visible tasks for this project
  const tasks = await db
    .select()
    .from(tasksSchema)
    .where(
      and(
        eq(tasksSchema.projectId, projectId),
        eq(tasksSchema.visibleToClient, true),
      ),
    )
    .orderBy(tasksSchema.createdAt);

  // Get invoices for this project
  const invoices = await db
    .select()
    .from(invoicesSchema)
    .where(eq(invoicesSchema.projectId, projectId))
    .orderBy(invoicesSchema.createdAt);

  // Get files for this project
  const projectFiles = await db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.projectId, projectId))
    .orderBy(filesSchema.createdAt);

  return (
    <>
      <TitleBar title={project.title} description="Project details" />

      <div className="mt-6 flex gap-4">
        <Link href="/client/projects">
          <Button variant="outline">← Back to Projects</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Project Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Status
              </dt>
              <dd className="mt-1">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-muted'
                  }`}
                >
                  {project.status}
                </span>
              </dd>
            </div>
            {project.description && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Description
                </dt>
                <dd className="mt-1 text-sm">{project.description}</dd>
              </div>
            )}
            {project.startDate && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Start Date
                </dt>
                <dd className="mt-1 text-sm">
                  {new Date(project.startDate).toLocaleDateString()}
                </dd>
              </div>
            )}
            {project.endDate && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  End Date
                </dt>
                <dd className="mt-1 text-sm">
                  {new Date(project.endDate).toLocaleDateString()}
                </dd>
              </div>
            )}
            {project.budget && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Budget
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  $
                  {project.budget.toFixed(2)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="space-y-4">
          {tasks.length > 0 && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Tasks</h3>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className="rounded-md border bg-background p-3"
                  >
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        {task.description}
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        {task.status}
                      </span>
                      {task.priority && (
                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {invoices.length > 0 && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Invoices</h3>
              <div className="space-y-2">
                {invoices.map(invoice => (
                  <Link
                    key={invoice.id}
                    href={`/client/invoices/${invoice.id}`}
                    className="block rounded-md border bg-background p-3 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{invoice.invoiceNumber}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          $
                          {invoice.total.toFixed(2)}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          invoice.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'Overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-muted'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {projectFiles.length > 0 && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Files</h3>
              <FileList
                files={projectFiles.map(f => ({
                  ...f,
                  size: f.size || 0,
                  mimeType: f.mimeType || 'application/octet-stream',
                  url: f.url,
                  createdAt: new Date(f.createdAt),
                }))}
                canDelete={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientProjectDetailPage;
