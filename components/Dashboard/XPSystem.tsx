'use client';

import { motion } from 'framer-motion';
import { Zap, Star } from 'lucide-react';
import { UserStats } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';

const LEVEL_TITLES: Record<number, string> = {
  1: 'Iniciante',
  2: 'Aprendiz',
  3: 'Estudante',
  4: 'Competidor',
  5: 'Atleta',
  6: 'Aspirante',
  7: 'Especialista',
  8: 'Avançado',
  9: 'Mestre',
  10: 'Lendário',
};

function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, 10)] || `Nível ${level}`;
}

export function XPSystem({ stats }: { stats: UserStats }) {
  const xpInLevel = stats.xp - stats.xpForCurrentLevel;
  const xpNeeded = stats.xpForNextLevel - stats.xpForCurrentLevel;
  const progress = Math.min(100, (xpInLevel / xpNeeded) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5 bg-gradient-to-br from-violet-600/5 to-blue-600/5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-yellow-400" />
        <h3 className="text-sm font-semibold text-white">Nível & XP</h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#1f2937" strokeWidth="4" />
            <motion.circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="url(#xp-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - progress / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="xp-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{stats.level}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-sm font-medium text-white">{getLevelTitle(stats.level)}</span>
          </div>
          <ProgressBar value={xpInLevel} max={xpNeeded} color="gradient" size="sm" animated />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-500">{xpInLevel} XP</span>
            <span className="text-[10px] text-gray-500">{xpNeeded} XP</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-800/60">
        <span className="text-xs text-gray-400">XP Total</span>
        <span className="text-sm font-bold text-violet-400 font-mono">{stats.xp.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}
