// Reusable sticky FormFooter component with customizable cancel, save, submitting state, and custom actions.
import React from 'react';
import { Button } from './button';

export interface FormFooterProps {
  onCancel?: () => void;
  cancelText?: string;
  submitText?: string;
  submittingText?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
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
  disabled = false,
  sticky = true,
  className = '',
  children,
}: FormFooterProps) {
  const baseClasses = sticky
    ? 'fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-end gap-2.5 sm:gap-3 z-40 shadow-lg'
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
        disabled={isSubmitting || disabled}
        className="bg-[#ff6600] px-5 sm:px-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? submittingText : submitText}
      </Button>
    </div>
  );
}

export default FormFooter;
