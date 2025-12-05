'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select type
}

interface FormFieldBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export function FormFieldBuilder({ fields, onChange }: FormFieldBuilderProps) {
  const [editingField, setEditingField] = useState<FormField | null>(null);

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: '',
      required: false,
      options: type === 'select' ? [''] : undefined,
    };
    setEditingField(newField);
  };

  const saveField = (field: FormField) => {
    if (fields.find((f) => f.id === field.id)) {
      // Update existing
      onChange(fields.map((f) => (f.id === field.id ? field : f)));
    } else {
      // Add new
      onChange([...fields, field]);
    }
    setEditingField(null);
  };

  const removeField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Form Fields</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addField('text')}
          >
            + Text
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addField('textarea')}
          >
            + Textarea
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addField('select')}
          >
            + Select
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addField('checkbox')}
          >
            + Checkbox
          </Button>
        </div>
      </div>

      {/* Existing Fields */}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2 rounded-md border p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-muted px-2 py-1 text-xs">{field.type}</span>
                <span className="font-medium">{field.label || '(No label)'}</span>
                {field.required && <span className="text-xs text-red-500">*</span>}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditingField(field)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeField(field.id)}
            >
              Remove
            </Button>
          </div>
        ))}
        {fields.length === 0 && (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            No fields yet. Click the buttons above to add fields.
          </div>
        )}
      </div>

      {/* Field Editor Modal/Dialog */}
      {editingField && (
        <FieldEditor
          field={editingField}
          onSave={saveField}
          onCancel={() => setEditingField(null)}
        />
      )}
    </div>
  );
}

interface FieldEditorProps {
  field: FormField;
  onSave: (field: FormField) => void;
  onCancel: () => void;
}

function FieldEditor({ field, onSave, onCancel }: FieldEditorProps) {
  const [editedField, setEditedField] = useState<FormField>(field);

  const updateField = (updates: Partial<FormField>) => {
    setEditedField({ ...editedField, ...updates });
  };

  const updateOptions = (index: number, value: string) => {
    const newOptions = [...(editedField.options || [])];
    newOptions[index] = value;
    updateField({ options: newOptions });
  };

  const addOption = () => {
    updateField({ options: [...(editedField.options || []), ''] });
  };

  const removeOption = (index: number) => {
    updateField({
      options: (editedField.options || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg border bg-background p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Edit {editedField.type} Field
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="field-label">Label *</Label>
            <Input
              id="field-label"
              value={editedField.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Enter field label"
            />
          </div>

          {(editedField.type === 'text' || editedField.type === 'textarea') && (
            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={editedField.placeholder || ''}
                onChange={(e) => updateField({ placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </div>
          )}

          {editedField.type === 'select' && (
            <div>
              <Label>Options</Label>
              <div className="mt-2 space-y-2">
                {(editedField.options || ['']).map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOptions(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  Add Option
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="field-required"
              checked={editedField.required}
              onChange={(e) => updateField({ required: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="field-required" className="cursor-pointer">
              Required field
            </Label>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button
            type="button"
            onClick={() => onSave(editedField)}
            disabled={!editedField.label}
          >
            Save Field
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

