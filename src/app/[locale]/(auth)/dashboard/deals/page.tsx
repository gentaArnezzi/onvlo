import { Plus } from 'lucide-react';
import Link from 'next/link';

import { PipelineBoard } from '@/components/deals/PipelineBoard';
import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';

import { getDeals, updateDealStage } from './actions';

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <>
      <TitleBar
        title="Deals Pipeline"
        description="Manage your sales pipeline and track deal progress"
      />

      <div className="mt-6 flex justify-end">
        <Link href="/dashboard/deals/new">
          <Button>
            <Plus className="mr-2 size-4" />
            New Deal
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <PipelineBoard
          initialDeals={deals}
          onDealMove={updateDealStage}
        />
      </div>
    </>
  );
}
