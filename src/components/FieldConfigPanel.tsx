
import React from 'react';
import { FormField } from '../types/FormTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash2 } from 'lucide-react';

interface FieldConfigPanelProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onClose: () => void;
}

const FieldConfigPanel: React.FC<FieldConfigPanelProps> = ({
  field,
  onUpdate,
  onClose,
}) => {
  const hasOptions = ['dropdown', 'checkbox', 'radio'].includes(field.type);

  const addOption = () => {
    const currentOptions = field.options || [];
    onUpdate({
      options: [...currentOptions, `Option ${currentOptions.length + 1}`]
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const deleteOption = (index: number) => {
    const newOptions = field.options?.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Field Settings</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={field.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="field-help">Help Text</Label>
          <Textarea
            id="field-help"
            value={field.helpText || ''}
            onChange={(e) => onUpdate({ helpText: e.target.value })}
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="field-required"
            checked={field.required}
            onCheckedChange={(checked) => onUpdate({ required: checked })}
          />
          <Label htmlFor="field-required">Required field</Label>
        </div>

        {hasOptions && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Options</Label>
              <Button variant="outline" size="sm" onClick={addOption}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteOption(index)}
                    disabled={(field.options?.length || 0) <= 1}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(field.type === 'text' || field.type === 'textarea') && (
          <div>
            <Label>Validation</Label>
            <div className="mt-2 space-y-3">
              <div>
                <Label htmlFor="min-length" className="text-sm">Min Length</Label>
                <Input
                  id="min-length"
                  type="number"
                  value={field.validation?.minLength || ''}
                  onChange={(e) => onUpdate({
                    validation: {
                      ...field.validation,
                      minLength: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="max-length" className="text-sm">Max Length</Label>
                <Input
                  id="max-length"
                  type="number"
                  value={field.validation?.maxLength || ''}
                  onChange={(e) => onUpdate({
                    validation: {
                      ...field.validation,
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {field.type === 'number' && (
          <div>
            <Label>Number Validation</Label>
            <div className="mt-2 space-y-3">
              <div>
                <Label htmlFor="min-value" className="text-sm">Min Value</Label>
                <Input
                  id="min-value"
                  type="number"
                  value={field.validation?.min || ''}
                  onChange={(e) => onUpdate({
                    validation: {
                      ...field.validation,
                      min: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="max-value" className="text-sm">Max Value</Label>
                <Input
                  id="max-value"
                  type="number"
                  value={field.validation?.max || ''}
                  onChange={(e) => onUpdate({
                    validation: {
                      ...field.validation,
                      max: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldConfigPanel;
