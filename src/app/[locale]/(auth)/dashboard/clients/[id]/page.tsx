import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getClientById, updateClient, deleteClient } from '../actions';
import { getProjectsByClient } from '../../projects/actions';
import { ClientFormWrapper } from '@/components/forms/ClientFormWrapper';

interface ClientDetailPageProps {
  params: { id: string; locale: string };
}

const ClientDetailPage = async ({ params }: ClientDetailPageProps) => {
  const clientId = Number(params.id);
  if (isNaN(clientId)) {
    notFound();
  }

  const client = await getClientById(clientId);
  if (!client) {
    notFound();
  }

  const projects = await getProjectsByClient(clientId);

  async function handleUpdate(data: Parameters<typeof updateClient>[1]) {
    'use server';
    await updateClient(clientId, data);
    redirect(`/dashboard/clients/${clientId}`);
  }

  async function handleDelete() {
    'use server';
    await deleteClient(clientId);
    redirect('/dashboard/clients');
  }

  return (
    <>
      <TitleBar
        title={`Client: ${client.name}`}
        description="View and manage client details"
      />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/clients">
          <Button variant="outline">← Back to Clients</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Client Information</h2>
          <ClientFormWrapper
            defaultValues={{
              name: client.name,
              email: client.email || '',
              phone: client.phone || '',
              company: client.company || '',
              status: client.status as any,
              notes: client.notes || '',
            }}
            onSubmit={handleUpdate}
            cancelUrl={`/dashboard/clients/${clientId}`}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Projects</h3>
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet</p>
            ) : (
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {project.title}
                    </Link>
                    <span className="ml-2 rounded-full bg-muted px-2 py-1 text-xs">
                      {project.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link href={`/dashboard/projects/new?clientId=${clientId}`}>
              <Button variant="outline" className="mt-4 w-full">
                Create New Project
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Actions</h3>
            <form action={handleDelete}>
              <Button type="submit" variant="destructive" className="w-full">
                Delete Client
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
                    {client.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="mt-1 text-sm">
                  {new Date(client.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd className="mt-1 text-sm">
                  {new Date(client.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDetailPage;
