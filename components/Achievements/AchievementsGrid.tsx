'use client';

import { motion } from 'framer-motion';
import { Achievement } from '@/types';
import { Lock } from 'lucide-react';

const CATEGORY_LABELS = {
  medals: 'Medalhas',
  performance: 'Desempenho',
  streak: 'Sequência',
  special: 'Especial',
};

interface AchievementsGridProps {
  achievements: Achievement[];
}

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      className={`
        relative flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all
        ${achievement.unlocked
          ? 'bg-gradient-to-b from-violet-600/10 to-gray-900/60 border-violet-500/30 hover:border-violet-500/50'
          : 'bg-gray-900/30 border-gray-800/40 opacity-50 grayscale'
        }
      `}
    >
      <div className={`text-3xl ${achievement.unlocked ? '' : 'opacity-30'}`}>
        {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-600" />}
      </div>
      <div>
        <p className={`text-xs font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-600'}`}>
          {achievement.name}
        </p>
        <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
          {achievement.description}
        </p>
      </div>
      <div className={`text-[10px] px-2 py-0.5 rounded-full border ${
        achievement.unlocked
          ? 'text-violet-400 bg-violet-500/10 border-violet-500/20'
          : 'text-gray-600 bg-gray-800/40 border-gray-700/40'
      }`}>
        +{achievement.xpReward} XP
      </div>
      {achievement.unlocked && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
      )}
    </motion.div>
  );
}

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  const categories = ['medals', 'performance', 'special', 'streak'] as const;
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-800 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlocked / achievements.length) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500"
          />
        </div>
        <span className="text-sm text-gray-400 flex-shrink-0">
          {unlocked}/{achievements.length} desbloqueadas
        </span>
      </div>

      {categories.map((cat) => {
        const items = achievements.filter((a) => a.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              {CATEGORY_LABELS[cat]}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((a, i) => (
                <AchievementCard key={a.id} achievement={a} index={i} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
