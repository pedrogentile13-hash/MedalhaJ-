'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/formatting';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'gold' | 'green' | 'blue' | 'gradient';
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  color = 'gradient',
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100);

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const colors = {
    purple: 'bg-violet-500',
    gold: 'bg-gradient-to-r from-yellow-500 to-amber-400',
    green: 'bg-gradient-to-r from-emerald-500 to-green-400',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-400',
    gradient: 'bg-gradient-to-r from-violet-600 to-blue-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-gray-400">{label}</span>}
          {showValue && (
            <span className="text-xs font-mono text-gray-300">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-800 rounded-full overflow-hidden', heights[size])}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn('h-full rounded-full', colors[color])}
        />
      </div>
    </div>
  );
}
