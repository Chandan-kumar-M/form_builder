
import React, { useState } from 'react';
import { FormField } from '../types/FormTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface FormPreviewProps {
  formFields: FormField[];
  previewMode: 'desktop' | 'tablet' | 'mobile';
  formTitle: string;
  formDescription: string;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  formFields,
  previewMode,
  formTitle,
  formDescription,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-md';
      default: return 'max-w-2xl';
    }
  };

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return 'This field is required';
    }

    if (field.validation) {
      const validation = field.validation;
      
      if (typeof value === 'string') {
        if (validation.minLength && value.length < validation.minLength) {
          return `Minimum length is ${validation.minLength} characters`;
        }
        if (validation.maxLength && value.length > validation.maxLength) {
          return `Maximum length is ${validation.maxLength} characters`;
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
          return 'Invalid format';
        }
      }

      if (typeof value === 'number') {
        if (validation.min !== undefined && value < validation.min) {
          return `Minimum value is ${validation.min}`;
        }
        if (validation.max !== undefined && value > validation.max) {
          return `Maximum value is ${validation.max}`;
        }
      }
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    formFields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!\n\n' + JSON.stringify(formData, null, 2));
    }
  };

  const renderField = (field: FormField) => {
    const fieldError = errors[field.id];
    const fieldValue = formData[field.id];

    const updateFieldValue = (value: any) => {
      setFormData(prev => ({ ...prev, [field.id]: value }));
      if (fieldError) {
        setErrors(prev => ({ ...prev, [field.id]: '' }));
      }
    };

    const renderInput = () => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
          return (
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={fieldValue || ''}
              onChange={(e) => updateFieldValue(e.target.value)}
              className={fieldError ? 'border-red-500' : ''}
            />
          );
        case 'textarea':
          return (
            <Textarea
              placeholder={field.placeholder}
              value={fieldValue || ''}
              onChange={(e) => updateFieldValue(e.target.value)}
              className={fieldError ? 'border-red-500' : ''}
              rows={3}
            />
          );
        case 'dropdown':
          return (
            <Select value={fieldValue || ''} onValueChange={updateFieldValue}>
              <SelectTrigger className={fieldError ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, idx) => (
                  <SelectItem key={idx} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        case 'checkbox':
          return (
            <div className="space-y-2">
              {field.options?.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${idx}`}
                    checked={(fieldValue || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const current = fieldValue || [];
                      if (checked) {
                        updateFieldValue([...current, option]);
                      } else {
                        updateFieldValue(current.filter((item: string) => item !== option));
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${idx}`}>{option}</Label>
                </div>
              ))}
            </div>
          );
        case 'radio':
          return (
            <RadioGroup value={fieldValue || ''} onValueChange={updateFieldValue}>
              {field.options?.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${idx}`} />
                  <Label htmlFor={`${field.id}-${idx}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          );
        case 'date':
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !fieldValue && 'text-muted-foreground',
                    fieldError && 'border-red-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fieldValue ? format(fieldValue, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fieldValue}
                  onSelect={updateFieldValue}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          );
        case 'file':
          return (
            <Input
              type="file"
              onChange={(e) => updateFieldValue(e.target.files?.[0])}
              className={fieldError ? 'border-red-500' : ''}
            />
          );
        default:
          return null;
      }
    };

    return (
      <div key={field.id} className="space-y-2">
        <Label className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {renderInput()}
        {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
        {field.helpText && <p className="text-xs text-gray-500">{field.helpText}</p>}
      </div>
    );
  };

  return (
    <div className="w-1/3 bg-gray-50 p-6 overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
        <div className="text-sm text-gray-600">
          Viewing in {previewMode} mode
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className={`mx-auto p-6 ${getPreviewWidth()}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{formTitle}</h1>
              {formDescription && (
                <p className="text-gray-600">{formDescription}</p>
              )}
            </div>

            {formFields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Add fields to see the preview</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {formFields.map(renderField)}
                </div>
                
                <Button type="submit" className="w-full">
                  Submit Form
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
