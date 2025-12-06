'use client';

import { Play, Square } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = async () => {
    setIsRunning(false);
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - elapsed * 1000);

    try {
      const { logTimeEntry } = await import('@/app/[locale]/(auth)/dashboard/time-tracking/actions');
      await logTimeEntry({
        description: description || 'Untitled Entry',
        startTime,
        endTime,
        duration: elapsed,
      });
    } catch (error) {
      console.error('Failed to save time entry:', error);
    }

    setElapsed(0);
    setDescription('');
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
      <Input
        placeholder="What are you working on?"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="flex-1"
        disabled={isRunning}
      />
      <div className="w-24 text-center font-mono text-xl font-medium">
        {formatTime(elapsed)}
      </div>
      {isRunning
        ? (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleStop}
              className="size-10"
            >
              <Square className="size-4 fill-current" />
            </Button>
          )
        : (
            <Button
              variant="default"
              size="icon"
              onClick={handleStart}
              className="size-10 bg-green-600 hover:bg-green-700"
            >
              <Play className="size-4 fill-current" />
            </Button>
          )}
    </div>
  );
}
