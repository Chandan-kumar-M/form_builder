
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentPalette from './ComponentPalette';
import FormCanvas from './FormCanvas';
import FormPreview from './FormPreview';
import FormHeader from './FormHeader';
import { FormField } from '../types/FormTypes';

const FormBuilder = () => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');

  const addField = (field: FormField) => {
    const newField = {
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setFormFields([...formFields, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  const deleteField = (fieldId: string) => {
    setFormFields(formFields.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const reorderFields = (dragIndex: number, hoverIndex: number) => {
    const newFields = [...formFields];
    const draggedField = newFields[dragIndex];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedField);
    setFormFields(newFields);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-white">
        <FormHeader 
          formTitle={formTitle}
          setFormTitle={setFormTitle}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          formFields={formFields}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <ComponentPalette onAddField={addField} />
          
          <FormCanvas
            formFields={formFields}
            selectedField={selectedField}
            setSelectedField={setSelectedField}
            updateField={updateField}
            deleteField={deleteField}
            reorderFields={reorderFields}
            formTitle={formTitle}
            formDescription={formDescription}
            setFormDescription={setFormDescription}
          />
          
          <FormPreview
            formFields={formFields}
            previewMode={previewMode}
            formTitle={formTitle}
            formDescription={formDescription}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
