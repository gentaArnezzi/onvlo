import { TimeEntryList } from '@/components/time-tracking/TimeEntryList';
import { Timer } from '@/components/time-tracking/Timer';
import { TitleBar } from '@/features/dashboard/TitleBar';

import { getTimeEntries } from './actions';

export default async function TimeTrackingPage() {
  const entries = await getTimeEntries();

  return (
    <>
      <TitleBar
        title="Time Tracking"
        description="Track time spent on projects and tasks"
      />

      <div className="mt-6 space-y-6">
        <Timer />
        <TimeEntryList entries={entries} />
      </div>
    </>
  );
}
