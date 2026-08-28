// Reusable common Modal component with backdrop click-outside dismiss, cross close button, and Escape key listener.
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className = '',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(open);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync open state with entrance/exit animation phases
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsAnimating(true), 15);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleClose]);

  if (!isVisible && !open) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[95vw]',
  };

  return (
    // Outer Backdrop Overlay: flex center + fade transition + click outside dismiss
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200 ease-in-out cursor-pointer ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* Inner Modal Content Panel */}
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white border border-slate-200 rounded-xl shadow-2xl w-full p-6 text-slate-900 relative max-h-[90vh] flex flex-col transition-all duration-200 ease-in-out cursor-default ${
          sizeClasses[size]
        } ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } ${className}`}
      >
        {/* Modal Header with Title & Cross Close Button */}
        {(title || description) && (
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5 shrink-0">
            <div>
              {title && typeof title === 'string' ? (
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
              ) : (
                title
              )}
              {description && (
                <p className="text-xs text-slate-500 mt-1 font-normal">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer ml-auto"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* If no title but cross button needed */}
        {!title && !description && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
