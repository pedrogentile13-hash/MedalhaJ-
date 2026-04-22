import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/formatting';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-gray-800/60 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all',
            error ? 'border-red-500/50' : 'border-gray-700/60 hover:border-gray-600',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-gray-800/60 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none',
            error ? 'border-red-500/50' : 'border-gray-700/60 hover:border-gray-600',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
