'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const agencyProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  logo: z.string().optional().nullable(),
});

export type AgencyProfileFormData = z.infer<typeof agencyProfileSchema>;

interface AgencyProfileFormProps {
  defaultValues?: Partial<AgencyProfileFormData>;
  onSubmit: (data: AgencyProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export function AgencyProfileForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: AgencyProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgencyProfileFormData>({
    resolver: zodResolver(agencyProfileSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Agency Name *</Label>
        <Input
          id="name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          {...register('slug')}
          className={errors.slug ? 'border-red-500' : ''}
          placeholder="my-agency"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          URL-friendly identifier (lowercase, no spaces). Used for public links.
        </p>
      </div>

      <div>
        <Label htmlFor="logo">Logo URL</Label>
        <Input
          id="logo"
          type="url"
          {...register('logo')}
          placeholder="https://example.com/logo.png"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          URL to your agency logo. For MVP, paste a direct image URL.
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}

