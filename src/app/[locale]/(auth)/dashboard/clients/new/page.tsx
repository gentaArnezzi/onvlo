import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { createClient } from '../actions';
import { ClientFormWrapper } from '@/components/forms/ClientFormWrapper';

const NewClientPage = async () => {
  async function handleCreate(data: Parameters<typeof createClient>[0]) {
    'use server';
    const client = await createClient(data);
    redirect(`/dashboard/clients/${client.id}`);
  }

  return (
    <>
      <TitleBar title="Create New Client" description="Add a new client" />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/clients">
          <Button variant="outline">← Back to Clients</Button>
        </Link>
      </div>

      <div className="mt-6">
        <div className="rounded-lg border bg-card p-6">
          <ClientFormWrapper onSubmit={handleCreate} />
        </div>
      </div>
    </>
  );
};

export default NewClientPage;
