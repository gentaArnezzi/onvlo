'use client';

import type {
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';

import { DealCard } from './DealCard';
import { PipelineStage } from './PipelineStage';

const STAGES = ['New', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'];

type PipelineBoardProps = {
  initialDeals: any[];
  onDealMove: (dealId: number, newStage: string) => void;
};

export function PipelineBoard({ initialDeals, onDealMove }: PipelineBoardProps) {
  const [deals, setDeals] = useState(initialDeals);
  const [activeDeal, setActiveDeal] = useState<any | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find(d => d.id === active.id);
    setActiveDeal(deal);
  };

  const handleDragOver = () => {
    // Optional: Handle visual updates during drag
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // If dropped on a stage container
    if (STAGES.includes(overId as string)) {
      const deal = deals.find(d => d.id === activeId);
      if (deal && deal.stage !== overId) {
        // Update local state
        setDeals(prev =>
          prev.map(d =>
            d.id === activeId ? { ...d, stage: overId as string } : d,
          ),
        );
        // Trigger server action
        onDealMove(Number(activeId), overId as string);
      }
    }

    setActiveDeal(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-200px)] gap-6 overflow-x-auto pb-6">
        {STAGES.map(stage => (
          <PipelineStage
            key={stage}
            id={stage}
            title={stage}
            deals={deals.filter(d => d.stage === stage)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
