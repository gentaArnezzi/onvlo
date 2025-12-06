'use client';

import { CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { createClientPaymentSession } from '../../actions';

type PayInvoiceButtonProps = {
  invoiceId: number;
};

export function PayInvoiceButton({ invoiceId }: PayInvoiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    try {
      setIsLoading(true);
      const url = await createClientPaymentSession(invoiceId);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      // In a real app, you'd want to use a toast notification library like react-hot-toast
      console.error('Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={isLoading} className="w-full">
      {isLoading
        ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Processing...
            </>
          )
        : (
            <>
              <CreditCard className="mr-2 size-4" />
              Pay Invoice
            </>
          )}
    </Button>
  );
}
