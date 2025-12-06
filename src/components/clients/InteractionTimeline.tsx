'use client';

import { format } from 'date-fns';
import { FileText, Mail, Phone, Users } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';

type Interaction = {
  id: number;
  type: string;
  content: string;
  date: Date;
  sentiment: string | null;
  performedBy: string;
};

type InteractionTimelineProps = {
  interactions: Interaction[];
};

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'call':
      return <Phone className="size-4" />;
    case 'email':
      return <Mail className="size-4" />;
    case 'meeting':
      return <Users className="size-4" />;
    default:
      return <FileText className="size-4" />;
  }
};

export function InteractionTimeline({ interactions }: InteractionTimelineProps) {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="relative ml-3 space-y-6 border-l border-muted">
        {interactions.length === 0
          ? (
              <div className="pl-6 text-sm text-muted-foreground">
                No interactions recorded yet.
              </div>
            )
          : (
              interactions.map(interaction => (
                <div key={interaction.id} className="relative pl-6">
                  <div className="absolute -left-1.5 top-1 size-3 rounded-full border border-background bg-muted-foreground/30" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        {getIcon(interaction.type)}
                        <span className="capitalize">{interaction.type}</span>
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(interaction.date), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90">{interaction.content}</p>
                    {interaction.sentiment && (
                      <div className="mt-1">
                        <span className={`rounded-full border px-1.5 py-0.5 text-[10px] ${
                          interaction.sentiment === 'Positive'
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : interaction.sentiment === 'Negative'
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : 'border-gray-200 bg-gray-50 text-gray-700'
                        }`}
                        >
                          {interaction.sentiment}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
      </div>
    </ScrollArea>
  );
}
