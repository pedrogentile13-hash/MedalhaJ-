import { MedalType } from '@/types';
import { getMedalConfig } from '@/utils/medals';
import { cn } from '@/utils/formatting';

interface MedalBadgeProps {
  medal: MedalType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function MedalBadge({ medal, size = 'md', showLabel = true }: MedalBadgeProps) {
  const config = getMedalConfig(medal);
  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  };
  const emojiSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        `bg-gradient-to-r ${config.bgGradient}`,
        config.border,
        config.text,
        sizes[size]
      )}
    >
      <span className={emojiSizes[size]}>{config.emoji}</span>
      {showLabel && config.label}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border-gray-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/10 text-red-400 border-red-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
