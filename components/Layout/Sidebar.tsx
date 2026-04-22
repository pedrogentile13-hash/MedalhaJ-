'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  Star,
  BarChart3,
  Medal,
  Zap,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/formatting';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/olympiads', label: 'Olimpíadas', icon: Trophy },
  { href: '/ranking', label: 'Ranking & Stats', icon: BarChart3 },
  { href: '/calendar', label: 'Calendário', icon: Calendar },
  { href: '/achievements', label: 'Conquistas', icon: Star },
];

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const stats = useStore((s) => s.getStats());

  return (
    <div className={cn(
      'flex flex-col h-full bg-gray-950 border-r border-gray-800/60',
      mobile ? 'w-full' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Medal className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white leading-tight">Dashboard</h1>
          <p className="text-xs text-violet-400 font-medium">Olímpico 2026</p>
        </div>
      </div>

      {/* XP Badge */}
      <div className="px-4 py-3 mx-4 mt-4 rounded-xl bg-gradient-to-r from-violet-600/10 to-blue-600/10 border border-violet-500/20">
        <div className="flex items-center gap-2 mb-1.5">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs text-gray-400">Nível {stats.level}</span>
          <span className="ml-auto text-xs text-violet-400 font-mono">{stats.xp} XP</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(100, ((stats.xp - stats.xpForCurrentLevel) / (stats.xpForNextLevel - stats.xpForCurrentLevel)) * 100)}%`,
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-gray-600 px-3 mb-2">Menu</p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-violet-600/20 to-blue-600/10 text-white border border-violet-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              )}
            >
              <Icon className={cn('w-4.5 h-4.5', active ? 'text-violet-400' : 'text-gray-500')} size={18} />
              {label}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Stats Summary */}
      <div className="px-4 py-4 border-t border-gray-800/60">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Provas', value: stats.totalOlympiads },
            { label: 'Medalhas', value: stats.totalMedals },
            { label: 'Média', value: `${stats.averagePercentage}%` },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-sm font-bold text-white">{value}</div>
              <div className="text-[10px] text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
