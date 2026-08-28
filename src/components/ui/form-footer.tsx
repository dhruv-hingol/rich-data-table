// Reusable sticky FormFooter component with customizable cancel, save, submitting state, and custom actions.
import React from 'react';
import { Button } from './button';

export interface FormFooterProps {
  onCancel?: () => void;
  cancelText?: string;
  submitText?: string;
  submittingText?: string;
  isSubmitting?: boolean;
  sticky?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function FormFooter({
  onCancel,
  cancelText = 'Cancel',
  submitText = 'Save',
  submittingText = 'Saving...',
  isSubmitting = false,
  sticky = true,
  className = '',
  children,
}: FormFooterProps) {
  const baseClasses = sticky
    ? 'fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-3.5 flex items-center justify-end gap-3 z-40 shadow-lg'
    : 'mt-8 pt-4 border-t border-slate-200 flex items-center justify-end gap-3';

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
      {onCancel && (
        <Button variant="outline" type="button" onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      <Button
        variant="primary"
        type="submit"
        disabled={isSubmitting}
        className="bg-[#ff6600] px-6"
      >
        {isSubmitting ? submittingText : submitText}
      </Button>
    </div>
  );
}

export default FormFooter;
