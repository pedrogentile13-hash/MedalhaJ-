'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/formatting';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: 'purple' | 'gold' | 'green' | 'blue' | 'red';
  delay?: number;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'purple',
  delay = 0,
}: StatsCardProps) {
  const colors = {
    purple: {
      icon: 'text-violet-400',
      iconBg: 'bg-violet-500/10',
      border: 'border-violet-500/10',
      glow: 'hover:shadow-violet-500/10',
    },
    gold: {
      icon: 'text-yellow-400',
      iconBg: 'bg-yellow-500/10',
      border: 'border-yellow-500/10',
      glow: 'hover:shadow-yellow-500/10',
    },
    green: {
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      border: 'border-emerald-500/10',
      glow: 'hover:shadow-emerald-500/10',
    },
    blue: {
      icon: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      border: 'border-blue-500/10',
      glow: 'hover:shadow-blue-500/10',
    },
    red: {
      icon: 'text-red-400',
      iconBg: 'bg-red-500/10',
      border: 'border-red-500/10',
      glow: 'hover:shadow-red-500/10',
    },
  };

  const c = colors[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        'relative bg-gray-900/60 backdrop-blur-sm border rounded-2xl p-5 hover:bg-gray-900/80 transition-all duration-300 hover:shadow-xl group',
        c.border,
        c.glow
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{title}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.5 }}
            className="text-2xl font-bold text-white tabular-nums"
          >
            {value}
          </motion.p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium',
              trend.value > 0 ? 'text-emerald-400' : trend.value < 0 ? 'text-red-400' : 'text-gray-400'
            )}>
              <span>{trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '→'}</span>
              <span>{Math.abs(trend.value).toFixed(1)}% {trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', c.iconBg)}>
          <Icon className={cn('w-5 h-5', c.icon)} />
        </div>
      </div>
    </motion.div>
  );
}
