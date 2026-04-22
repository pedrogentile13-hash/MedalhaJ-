'use client';

import { useMemo } from 'react';
import { Star, Zap, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/Layout/AppLayout';
import { AchievementsGrid } from '@/components/Achievements/AchievementsGrid';
import { XPSystem } from '@/components/Dashboard/XPSystem';
import { useStore } from '@/store/useStore';

export default function AchievementsPage() {
  const { getStats, getAchievements } = useStore((s) => ({
    getStats: s.getStats,
    getAchievements: s.getAchievements,
  }));

  const stats = getStats();
  const achievements = getAchievements();
  const unlocked = achievements.filter((a) => a.unlocked);
  const totalXPFromAchievements = unlocked.reduce((s, a) => s + a.xpReward, 0);

  return (
    <AppLayout title="Conquistas">
      <div className="space-y-6">
        {/* Summary row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <XPSystem stats={stats} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/60 border border-yellow-500/20 rounded-2xl p-5 bg-gradient-to-br from-yellow-500/5 to-transparent"
          >
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-semibold text-white">Conquistas</h3>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{unlocked.length}</div>
            <div className="text-xs text-gray-400 mt-1">de {achievements.length} desbloqueadas</div>
            <div className="mt-3 w-full bg-gray-800 rounded-full h-1.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-400"
                style={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-900/60 border border-violet-500/20 rounded-2xl p-5 bg-gradient-to-br from-violet-500/5 to-transparent"
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white">XP de Conquistas</h3>
            </div>
            <div className="text-3xl font-bold text-violet-400">{totalXPFromAchievements.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">XP ganho em conquistas</div>
            <div className="text-xs text-gray-600 mt-2">
              Restante: {achievements.filter((a) => !a.unlocked).reduce((s, a) => s + a.xpReward, 0).toLocaleString()} XP disponíveis
            </div>
          </motion.div>
        </div>

        {/* Achievements grid */}
        <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">Todas as Conquistas</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Lock className="w-3 h-3" />
              <span>{achievements.length - unlocked.length} bloqueadas</span>
            </div>
          </div>
          <AchievementsGrid achievements={achievements} />
        </div>
      </div>
    </AppLayout>
  );
}
