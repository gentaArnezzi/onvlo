import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getLeads, updateLead } from '../actions';
import { LeadsKanbanView } from '@/components/kanban/LeadsKanbanView';

const LeadsKanbanPage = async () => {
  const leads = await getLeads();

  async function handleMoveLead(
    leadId: string,
    fromStage: string,
    toStage: string,
  ) {
    'use server';
    await updateLead(Number(leadId), { stage: toStage });
    redirect('/dashboard/leads/kanban');
  }

  return (
    <>
      <TitleBar
        title="Leads Kanban"
        description="Manage leads in a visual board"
      />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/leads">
          <Button variant="outline">← Back to List View</Button>
        </Link>
        <Link href="/dashboard/leads/new">
          <Button>Add Lead</Button>
        </Link>
      </div>

      <div className="mt-6">
        <LeadsKanbanView leads={leads} onMoveLead={handleMoveLead} />
      </div>
    </>
  );
};

export default LeadsKanbanPage;

