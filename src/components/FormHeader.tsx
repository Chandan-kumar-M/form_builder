
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '../types/FormTypes';
import { Eye, Share, Download, Monitor, Tablet, Smartphone } from 'lucide-react';

interface FormHeaderProps {
  formTitle: string;
  setFormTitle: (title: string) => void;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  formFields: FormField[];
}

const FormHeader: React.FC<FormHeaderProps> = ({
  formTitle,
  setFormTitle,
  previewMode,
  setPreviewMode,
  formFields,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const generateFormId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleShare = () => {
    const formId = generateFormId();
    const shareUrl = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Form URL copied to clipboard: ${shareUrl}`);
  };

  const handleExport = () => {
    const formData = {
      title: formTitle,
      fields: formFields,
      createdAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formTitle.replace(/\s+/g, '_')}_form.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
              className="text-xl font-semibold"
              autoFocus
            />
          ) : (
            <h1
              className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >
              {formTitle}
            </h1>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {formFields.length} field{formFields.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('desktop')}
            className="px-3"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={previewMode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('tablet')}
            className="px-3"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('mobile')}
            className="px-3"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        
        <Button onClick={handleShare}>
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </header>
  );
};

export default FormHeader;
