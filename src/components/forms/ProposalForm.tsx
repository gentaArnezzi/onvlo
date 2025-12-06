'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const proposalFormSchema = z.object({
  templateId: z.number().optional(),
  clientId: z.number().optional(),
  leadId: z.number().optional(),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['Draft', 'Sent', 'Accepted', 'Rejected']),
});

export type ProposalFormData = z.infer<typeof proposalFormSchema>;

const emptyClients: Array<{ id: number; name: string }> = [];
const emptyLeads: Array<{ id: number; name: string }> = [];
const emptyTemplates: Array<{ id: number; name: string }> = [];

type ProposalFormProps = {
  defaultValues?: Partial<ProposalFormData>;
  onSubmit: (data: ProposalFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  clients?: Array<{ id: number; name: string }>;
  leads?: Array<{ id: number; name: string }>;
  templates?: Array<{ id: number; name: string }>;
};

export function ProposalForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  clients,
  leads,
  templates,
}: ProposalFormProps) {
  const resolvedClients = clients ?? emptyClients;
  const resolvedLeads = leads ?? emptyLeads;
  const resolvedTemplates = templates ?? emptyTemplates;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      status: 'Draft',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="templateId">Template (Optional)</Label>
        <select
          id="templateId"
          {...register('templateId', { valueAsNumber: true })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">None</option>
          {resolvedTemplates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientId">Client (Optional)</Label>
          <select
            id="clientId"
            {...register('clientId', { valueAsNumber: true })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">None</option>
            {resolvedClients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="leadId">Lead (Optional)</Label>
          <select
            id="leadId"
            {...register('leadId', { valueAsNumber: true })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">None</option>
            {resolvedLeads.map(lead => (
              <option key={lead.id} value={lead.id}>
                {lead.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="content">Proposal Content *</Label>
        <textarea
          id="content"
          {...register('content')}
          rows={12}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Enter proposal content. You can use placeholders like {{client_name}}, {{price}}, etc."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          {...register('status')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
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
