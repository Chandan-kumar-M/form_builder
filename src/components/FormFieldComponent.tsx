
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
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
import { CalendarIcon, Settings, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface FormFieldComponentProps {
  field: FormField;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const FormFieldComponent: React.FC<FormFieldComponentProps> = ({
  field,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onReorder,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [date, setDate] = React.useState<Date>();

  const [{ handlerId }, drop] = useDrop({
    accept: 'form-field',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onReorder(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'form-field',
    item: () => ({ id: field.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(ref));

  const renderFieldInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            disabled
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            required={field.required}
            disabled
            rows={3}
          />
        );
      case 'dropdown':
        return (
          <Select disabled>
            <SelectTrigger>
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
                <Checkbox id={`${field.id}-${idx}`} disabled />
                <Label htmlFor={`${field.id}-${idx}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'radio':
        return (
          <RadioGroup disabled>
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${idx}`} disabled />
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
                  !date && 'text-muted-foreground'
                )}
                disabled
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
          </Popover>
        );
      case 'file':
        return (
          <Input type="file" disabled />
        );
      default:
        return <Input disabled />;
    }
  };

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`group p-4 border-2 rounded-lg transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div
            ref={drag}
            className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <Label className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
      
      {renderFieldInput()}
      
      {field.helpText && (
        <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
      )}
    </div>
  );
};

export default FormFieldComponent;
