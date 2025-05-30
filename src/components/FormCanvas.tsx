
import React from 'react';
import { useDrop } from 'react-dnd';
import { FormField } from '../types/FormTypes';
import FormFieldComponent from './FormFieldComponent';
import FieldConfigPanel from './FieldConfigPanel';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormCanvasProps {
  formFields: FormField[];
  selectedField: FormField | null;
  setSelectedField: (field: FormField | null) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  deleteField: (fieldId: string) => void;
  reorderFields: (dragIndex: number, hoverIndex: number) => void;
  formTitle: string;
  formDescription: string;
  setFormDescription: (description: string) => void;
}

const FormCanvas: React.FC<FormCanvasProps> = ({
  formFields,
  selectedField,
  setSelectedField,
  updateField,
  deleteField,
  reorderFields,
  formTitle,
  formDescription,
  setFormDescription,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'field',
    drop: () => ({}),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className="flex-1 flex">
      <div className="flex-1 p-6 overflow-y-auto">
        <div
          ref={drop}
          className={`min-h-full ${
            isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
          }`}
        >
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{formTitle}</h1>
              <Textarea
                placeholder="Add a description for your form..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full resize-none border-none bg-transparent text-gray-600 text-lg p-0 focus:ring-0"
                rows={2}
              />
            </div>

            {formFields.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-medium mb-2">Start building your form</h3>
                <p>Drag components from the left panel to add fields</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formFields.map((field, index) => (
                  <FormFieldComponent
                    key={field.id}
                    field={field}
                    index={index}
                    isSelected={selectedField?.id === field.id}
                    onSelect={() => setSelectedField(field)}
                    onUpdate={(updates) => updateField(field.id, updates)}
                    onDelete={() => deleteField(field.id)}
                    onReorder={reorderFields}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedField && (
        <FieldConfigPanel
          field={selectedField}
          onUpdate={(updates) => updateField(selectedField.id, updates)}
          onClose={() => setSelectedField(null)}
        />
      )}
    </div>
  );
};

export default FormCanvas;
