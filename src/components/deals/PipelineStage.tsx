'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { DealCard } from './DealCard';

type PipelineStageProps = {
  id: string;
  title: string;
  deals: any[];
};

export function PipelineStage({ id, title, deals }: PipelineStageProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex w-80 shrink-0 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {deals.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex min-h-[500px] flex-1 flex-col gap-3 rounded-lg bg-muted/30 p-2"
      >
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
        {deals.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/20 text-xs text-muted-foreground">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
