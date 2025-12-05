'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0, 'Quantity must be >= 0'),
  unitPrice: z.number().min(0, 'Unit price must be >= 0'),
});

const invoiceFormSchema = z.object({
  clientId: z.number().min(1, 'Client is required'),
  projectId: z.number().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  taxRate: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  defaultValues?: Partial<InvoiceFormData>;
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  clients?: Array<{ id: number; name: string }>;
  projects?: Array<{ id: number; title: string }>;
}

export function InvoiceForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  clients = [],
  projects = [],
}: InvoiceFormProps) {
  const [items, setItems] = useState<
    Array<{ description: string; quantity: number; unitPrice: number }>
  >(
    defaultValues?.items || [
      { description: '', quantity: 1, unitPrice: 0 },
    ],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      taxRate: 0,
      items: defaultValues?.items || [
        { description: '', quantity: 1, unitPrice: 0 },
      ],
      ...defaultValues,
    },
  });

  const taxRate = watch('taxRate') || 0;

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: 'description' | 'quantity' | 'unitPrice',
    value: string | number,
  ) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'description' ? value : Number(value),
    };
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit({ ...data, items });
      })}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="clientId">Client *</Label>
        <select
          id="clientId"
          {...register('clientId', { valueAsNumber: true })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p className="mt-1 text-sm text-red-500">{errors.clientId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="projectId">Project (Optional)</Label>
        <select
          id="projectId"
          {...register('projectId', { valueAsNumber: true })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">None</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number *</Label>
          <Input
            id="invoiceNumber"
            {...register('invoiceNumber')}
            className={errors.invoiceNumber ? 'border-red-500' : ''}
          />
          {errors.invoiceNumber && (
            <p className="mt-1 text-sm text-red-500">
              {errors.invoiceNumber.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className={errors.dueDate ? 'border-red-500' : ''}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-500">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="taxRate">Tax Rate (%)</Label>
        <Input
          id="taxRate"
          type="number"
          step="0.01"
          {...register('taxRate', { valueAsNumber: true })}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Line Items *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            Add Item
          </Button>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 rounded-md border p-2">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, 'quantity', e.target.value)
                }
                className="w-20"
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Price"
                value={item.unitPrice}
                onChange={(e) =>
                  updateItem(index, 'unitPrice', e.target.value)
                }
                className="w-32"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        {errors.items && (
          <p className="mt-1 text-sm text-red-500">{errors.items.message}</p>
        )}
      </div>

      <div className="rounded-md border bg-muted p-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({taxRate}%):</span>
          <span>${calculateTax().toFixed(2)}</span>
        </div>
        <div className="mt-2 flex justify-between font-bold">
          <span>Total:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
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

