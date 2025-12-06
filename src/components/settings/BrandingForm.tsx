'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const brandingSchema = z.object({
  brandColor: z.string().optional().nullable(),
});

export type BrandingFormData = z.infer<typeof brandingSchema>;

type BrandingFormProps = {
  defaultValues?: Partial<BrandingFormData>;
  onSubmit: (data: BrandingFormData) => Promise<void>;
  isLoading?: boolean;
};

export function BrandingForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: BrandingFormProps) {
  const {
    register,
    handleSubmit,
    watch,
  } = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      brandColor: '#000000',
      ...defaultValues,
    },
  });

  const brandColor = watch('brandColor') || '#000000';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="brandColor">Brand Color</Label>
        <div className="mt-2 flex items-center gap-4">
          <Input
            id="brandColor"
            type="color"
            {...register('brandColor')}
            className="h-12 w-24 cursor-pointer"
          />
          <Input
            type="text"
            {...register('brandColor')}
            placeholder="#000000"
            className="flex-1 font-mono"
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Primary brand color used in invoices and proposals
        </p>
      </div>

      <div className="rounded-md border bg-muted p-4">
        <p className="mb-2 text-sm font-medium">Preview</p>
        <div
          className="h-16 rounded-md"
          style={{ backgroundColor: brandColor }}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
