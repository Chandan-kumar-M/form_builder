
export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio' | 'date' | 'email' | 'number' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface FormData {
  title: string;
  description: string;
  fields: FormField[];
  settings: {
    theme: 'light' | 'dark';
    submitButtonText: string;
    successMessage: string;
  };
}
