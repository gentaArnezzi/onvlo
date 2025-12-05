'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface KanbanColumn {
  id: string;
  title: string;
  items: any[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onItemMove: (itemId: string, fromColumn: string, toColumn: string) => void;
  onItemClick?: (item: any) => void;
  renderItem: (item: any) => React.ReactNode;
}

export function KanbanBoard({
  columns,
  onItemMove,
  onItemClick,
  renderItem,
}: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);

  const handleDragStart = (itemId: string, columnId: string) => {
    setDraggedItem(itemId);
    setDraggedFrom(columnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (draggedItem && draggedFrom && draggedFrom !== columnId) {
      onItemMove(draggedItem, draggedFrom, columnId);
    }
    setDraggedItem(null);
    setDraggedFrom(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex min-w-[280px] flex-col rounded-lg border bg-card"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
        >
          <div className="border-b p-4">
            <h3 className="font-semibold">
              {column.title} ({column.items.length})
            </h3>
          </div>
          <div className="flex-1 space-y-2 p-4">
            {column.items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item.id, column.id)}
                onClick={() => onItemClick?.(item)}
                className="cursor-move rounded-md border bg-background p-3 shadow-sm transition-shadow hover:shadow-md"
              >
                {renderItem(item)}
              </div>
            ))}
            {column.items.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No items
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

