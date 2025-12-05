'use client';

import { useRouter } from 'next/navigation';
import { KanbanBoard, type KanbanColumn } from './KanbanBoard';

const LEAD_STAGES = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost',
] as const;

interface Lead {
  id: number;
  name: string;
  email: string | null;
  company: string | null;
  stage: string;
  source: string | null;
}

interface LeadsKanbanViewProps {
  leads: Lead[];
  onMoveLead: (leadId: string, fromStage: string, toStage: string) => Promise<void>;
}

export function LeadsKanbanView({
  leads,
  onMoveLead,
}: LeadsKanbanViewProps) {
  const router = useRouter();

  // Group leads by stage
  const columns: KanbanColumn[] = LEAD_STAGES.map((stage) => ({
    id: stage,
    title: stage,
    items: leads.filter((lead) => lead.stage === stage),
  }));

  const handleItemMove = async (
    itemId: string,
    fromColumn: string,
    toColumn: string,
  ) => {
    await onMoveLead(itemId, fromColumn, toColumn);
    router.refresh();
  };

  const handleItemClick = (lead: Lead) => {
    router.push(`/dashboard/leads/${lead.id}`);
  };

  const renderLead = (lead: Lead) => (
    <div>
      <div className="font-medium">{lead.name}</div>
      {lead.company && (
        <div className="mt-1 text-sm text-muted-foreground">{lead.company}</div>
      )}
      {lead.email && (
        <div className="mt-1 text-xs text-muted-foreground">{lead.email}</div>
      )}
      {lead.source && (
        <div className="mt-2">
          <span className="rounded-full bg-muted px-2 py-1 text-xs">
            {lead.source}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <KanbanBoard
      columns={columns}
      onItemMove={handleItemMove}
      onItemClick={handleItemClick}
      renderItem={renderLead}
    />
  );
}

