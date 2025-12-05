'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CopyLinkButtonProps {
  url: string;
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${url}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="w-full">
      {copied ? 'Copied!' : 'Copy Link'}
    </Button>
  );
}

