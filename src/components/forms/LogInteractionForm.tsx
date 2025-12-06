'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { logInteraction } from '@/app/[locale]/(auth)/dashboard/clients/actions';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type LogInteractionFormProps = {
  clientId: number;
};

export function LogInteractionForm({ clientId }: LogInteractionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('Call');
  const [content, setContent] = useState('');
  const [sentiment, setSentiment] = useState('Neutral');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await logInteraction({
        clientId,
        type,
        content,
        sentiment,
      });
      setContent('');
      router.refresh();
    } catch (error) {
      console.error('Failed to log interaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="interaction-type" className="text-sm font-medium">Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="interaction-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Call">Call</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Meeting">Meeting</SelectItem>
              <SelectItem value="Note">Note</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="sentiment" className="text-sm font-medium">Sentiment</label>
          <Select value={sentiment} onValueChange={setSentiment}>
            <SelectTrigger id="sentiment">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Positive">Positive</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
              <SelectItem value="Negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">Notes</label>
        <Textarea
          id="notes"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Enter interaction details..."
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging...' : 'Log Interaction'}
      </Button>
    </form>
  );
}
