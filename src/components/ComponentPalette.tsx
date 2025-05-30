
import React from 'react';
import { useDrag } from 'react-dnd';
import { FormField } from '../types/FormTypes';
import { 
  Type, 
  AlignLeft, 
  ChevronDown, 
  CheckSquare, 
  Circle, 
  Calendar, 
  Mail, 
  Hash, 
  Upload 
} from 'lucide-react';

interface ComponentPaletteProps {
  onAddField: (field: FormField) => void;
}

const fieldTypes = [
  { type: 'text', label: 'Text Input', icon: Type },
  { type: 'textarea', label: 'Textarea', icon: AlignLeft },
  { type: 'dropdown', label: 'Dropdown', icon: ChevronDown },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'radio', label: 'Radio Buttons', icon: Circle },
  { type: 'date', label: 'Date Picker', icon: Calendar },
  { type: 'email', label: 'Email Input', icon: Mail },
  { type: 'number', label: 'Number Input', icon: Hash },
  { type: 'file', label: 'File Upload', icon: Upload },
];

interface DraggableFieldProps {
  type: string;
  label: string;
  icon: React.ComponentType<any>;
  onAddField: (field: FormField) => void;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ type, label, icon: Icon, onAddField }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'field',
    item: { type },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        const newField: FormField = {
          id: '',
          type: type as any,
          label: `${label}`,
          required: false,
          options: ['checkbox', 'radio', 'dropdown'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
        };
        onAddField(newField);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-900">{label}</span>
      </div>
    </div>
  );
};

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onAddField }) => {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Components</h2>
      <div className="space-y-3">
        {fieldTypes.map((fieldType) => (
          <DraggableField
            key={fieldType.type}
            type={fieldType.type}
            label={fieldType.label}
            icon={fieldType.icon}
            onAddField={onAddField}
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">How to use:</h3>
        <p className="text-xs text-blue-700">
          Drag components from here to the form canvas to add them to your form.
        </p>
      </div>
    </div>
  );
};

export default ComponentPalette;
