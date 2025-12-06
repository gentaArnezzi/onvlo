'use client';

import { format } from 'date-fns';

type TimeEntry = {
  id: number;
  description: string | null;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  billable: boolean;
  project?: { title: string } | null;
  task?: { title: string } | null;
};

type TimeEntryListProps = {
  entries: TimeEntry[];
};

export function TimeEntryList({ entries }: TimeEntryListProps) {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) {
      return '-';
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <h3 className="font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y">
        {entries.length === 0
          ? (
              <div className="p-8 text-center text-muted-foreground">
                No time entries yet
              </div>
            )
          : (
              entries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">
                      {entry.description || '(No description)'}
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      {entry.project && (
                        <span className="font-medium text-primary">
                          {entry.project.title}
                        </span>
                      )}
                      {entry.task && (
                        <>
                          <span>•</span>
                          <span>{entry.task.title}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-6">
                    <div className="text-right text-sm">
                      <div className="font-mono font-medium">
                        {formatDuration(entry.duration)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(entry.startTime), 'h:mm a')}
                        {' '}
                        -
                        {' '}
                        {entry.endTime
                          ? format(new Date(entry.endTime), 'h:mm a')
                          : 'Now'}
                      </div>
                    </div>
                    {entry.billable && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                        $
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
      </div>
    </div>
  );
}
