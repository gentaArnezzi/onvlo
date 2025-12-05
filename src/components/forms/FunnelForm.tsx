'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { FormFieldBuilder, type FormField } from './FormFieldBuilder';

const funnelFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  isActive: z.boolean(),
  agreementTemplate: z.string().optional(),
  autoCreateProject: z.boolean(),
  projectTemplate: z.string().optional(),
});

export type FunnelFormData = z.infer<typeof funnelFormSchema> & {
  formFields?: FormField[];
};

interface FunnelFormProps {
  defaultValues?: Partial<FunnelFormData>;
  onSubmit: (data: FunnelFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  organizationSlug?: string;
}

export function FunnelForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  organizationSlug = '',
}: FunnelFormProps) {
  const [formFields, setFormFields] = useState<FormField[]>(
    defaultValues?.formFields || [],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FunnelFormData>({
    resolver: zodResolver(funnelFormSchema),
    defaultValues: {
      isActive: true,
      autoCreateProject: false,
      ...defaultValues,
    },
  });

  const slug = watch('slug');
  const autoCreateProject = watch('autoCreateProject');
  const publicUrl = organizationSlug && slug
    ? `/onboard/${organizationSlug}/${slug}`
    : '';

  const handleFormSubmit = async (data: FunnelFormData) => {
    await onSubmit({ ...data, formFields });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Funnel Name *</Label>
        <Input
          id="name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
          placeholder="e.g., FB Ads Retainer"
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
          placeholder="fb-ads-retainer"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          URL-friendly identifier (lowercase, no spaces)
        </p>
      </div>

      {publicUrl && (
        <div className="rounded-md border bg-muted p-3">
          <Label className="text-xs text-muted-foreground">Public URL</Label>
          <div className="mt-1 space-y-2">
            <code className="block w-full rounded bg-background px-2 py-1 text-sm break-all">
              {publicUrl}
            </code>
            <CopyLinkButton url={publicUrl} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          {...register('isActive')}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Active (funnel is accessible)
        </Label>
      </div>

      {/* Form Builder */}
      <div className="rounded-md border bg-muted p-4">
        <FormFieldBuilder fields={formFields} onChange={setFormFields} />
      </div>

      <div>
        <Label htmlFor="agreementTemplate">Agreement Template</Label>
        <textarea
          id="agreementTemplate"
          {...register('agreementTemplate')}
          rows={8}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Enter the agreement/terms that clients will see and need to accept..."
        />
        <p className="mt-1 text-xs text-muted-foreground">
          This will be shown to clients before they complete onboarding
        </p>
      </div>

      {/* Auto-Create Project Settings */}
      <div className="rounded-md border bg-muted p-4">
        <div className="mb-3 flex items-center gap-2">
          <input
            type="checkbox"
            id="autoCreateProject"
            {...register('autoCreateProject')}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="autoCreateProject" className="cursor-pointer">
            Auto-create project after onboarding
          </Label>
        </div>

        {autoCreateProject && (
          <div>
            <Label htmlFor="projectTemplate">Project Template</Label>
            <Input
              id="projectTemplate"
              {...register('projectTemplate')}
              placeholder="e.g., FB Ads Campaign"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Project title template. You can use placeholders like
              {'{{client_name}}'}, {'{{company}}'}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

