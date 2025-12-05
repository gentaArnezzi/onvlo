'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FormField } from '@/components/forms/FormFieldBuilder';

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  onBack?: () => void;
}

export function DynamicForm({ fields, onSubmit, onBack }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const updateField = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value });
    // Clear error when user starts typing
    if (errors[fieldId]) {
      const newErrors = { ...errors };
      delete newErrors[fieldId];
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.id}>
          <Label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-red-500"> *</span>}
          </Label>

          {field.type === 'text' && (
            <Input
              id={field.id}
              type="text"
              value={formData[field.id] || ''}
              onChange={(e) => updateField(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={errors[field.id] ? 'border-red-500' : ''}
            />
          )}

          {field.type === 'textarea' && (
            <textarea
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => updateField(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`flex w-full rounded-md border ${
                errors[field.id] ? 'border-red-500' : 'border-input'
              } bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
            />
          )}

          {field.type === 'select' && (
            <select
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => updateField(field.id, e.target.value)}
              className={`flex h-9 w-full rounded-md border ${
                errors[field.id] ? 'border-red-500' : 'border-input'
              } bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
            >
              <option value="">Select an option</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {field.type === 'checkbox' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={field.id}
                checked={formData[field.id] || false}
                onChange={(e) => updateField(field.id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor={field.id} className="cursor-pointer font-normal">
                {field.placeholder || field.label}
              </Label>
            </div>
          )}

          {errors[field.id] && (
            <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}

