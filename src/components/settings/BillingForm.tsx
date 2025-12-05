'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const billingSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'),
  defaultCurrency: z.string().min(1, 'Currency is required'),
  defaultInvoiceTerms: z.string().min(1, 'Invoice terms are required'),
});

export type BillingFormData = z.infer<typeof billingSchema>;

interface BillingFormProps {
  defaultValues?: Partial<BillingFormData>;
  onSubmit: (data: BillingFormData) => Promise<void>;
  isLoading?: boolean;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'IDR', 'SGD', 'AUD', 'JPY', 'CNY'];
const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Jakarta',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export function BillingForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: BillingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      timezone: 'UTC',
      defaultCurrency: 'USD',
      defaultInvoiceTerms: 'Net 30',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="timezone">Timezone *</Label>
        <select
          id="timezone"
          {...register('timezone')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        {errors.timezone && (
          <p className="mt-1 text-sm text-red-500">{errors.timezone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="defaultCurrency">Default Currency *</Label>
        <select
          id="defaultCurrency"
          {...register('defaultCurrency')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        {errors.defaultCurrency && (
          <p className="mt-1 text-sm text-red-500">
            {errors.defaultCurrency.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="defaultInvoiceTerms">Default Invoice Terms *</Label>
        <Input
          id="defaultInvoiceTerms"
          {...register('defaultInvoiceTerms')}
          placeholder="Net 30"
          className={errors.defaultInvoiceTerms ? 'border-red-500' : ''}
        />
        {errors.defaultInvoiceTerms && (
          <p className="mt-1 text-sm text-red-500">
            {errors.defaultInvoiceTerms.message}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Default payment terms for new invoices (e.g., "Net 30", "Due on receipt")
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}

