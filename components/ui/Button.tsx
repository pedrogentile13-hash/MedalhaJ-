'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/formatting';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading, className, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-500/25 focus:ring-violet-500',
      secondary:
        'bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 focus:ring-gray-600',
      ghost:
        'bg-transparent hover:bg-gray-800/60 text-gray-300 hover:text-white focus:ring-gray-600',
      danger:
        'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 focus:ring-red-500',
      gold: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-gray-900 font-bold shadow-lg shadow-yellow-500/25 focus:ring-yellow-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
