'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SignatureFormProps = {
  proposalId: number;
  onSign: (signedBy: string) => Promise<void>;
};

export function SignatureForm({ onSign }: SignatureFormProps) {
  const [signedBy, setSignedBy] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signedBy.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!agreed) {
      setError('Please agree to the terms');
      return;
    }

    setIsLoading(true);
    try {
      await onSign(signedBy);
    } catch (err: any) {
      setError(err.message || 'Failed to sign proposal');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold">Sign Proposal</h3>

      <div>
        <Label htmlFor="signedBy">Full Name *</Label>
        <Input
          id="signedBy"
          type="text"
          value={signedBy}
          onChange={e => setSignedBy(e.target.value)}
          placeholder="Enter your full name"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-start gap-3 rounded-md border bg-muted p-4">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          disabled={isLoading}
          className="mt-1 size-4 shrink-0 rounded border-gray-300"
        />
        <Label htmlFor="agree" className="cursor-pointer">
          I have read and agree to the terms outlined in this proposal. By signing, I
          acknowledge that this constitutes a legally binding agreement.
        </Label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Signing...' : 'Sign Proposal'}
      </Button>

      <p className="text-xs text-muted-foreground">
        By signing, your name, timestamp, and IP address will be recorded for legal
        purposes.
      </p>
    </form>
  );
}
