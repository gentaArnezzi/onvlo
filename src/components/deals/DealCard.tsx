'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Deal = {
  id: number;
  title: string;
  value: number;
  currency: string;
  priority: string;
  expectedCloseDate: Date | null;
  ownerId: string | null;
};

type DealCardProps = {
  deal: Deal;
};

export function DealCard({ deal }: DealCardProps) {
  return (
    <Link href={`/dashboard/deals/${deal.id}`}>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-sm font-medium leading-tight">
              {deal.title}
            </CardTitle>
            <Badge variant={deal.priority === 'High' ? 'destructive' : 'secondary'} className="px-1 py-0 text-[10px]">
              {deal.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="text-lg font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: deal.currency || 'USD',
            }).format(deal.value || 0)}
          </div>
          {deal.expectedCloseDate && (
            <div className="mt-2 text-xs text-muted-foreground">
              Closes
              {' '}
              {formatDistanceToNow(new Date(deal.expectedCloseDate), { addSuffix: true })}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
