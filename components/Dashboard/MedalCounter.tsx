'use client';

import { motion } from 'framer-motion';
import { UserStats, MedalType } from '@/types';
import { MEDAL_CONFIG } from '@/utils/medals';

const ORDER: MedalType[] = ['gold', 'silver', 'bronze', 'honor'];

export function MedalCounter({ stats }: { stats: UserStats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Suas Medalhas</h3>
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
          {stats.totalMedals} total
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {ORDER.map((medal, i) => {
          const config = MEDAL_CONFIG[medal];
          const count = stats.medals[medal];
          return (
            <motion.div
              key={medal}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className={`flex items-center gap-3 p-3 rounded-xl border bg-gradient-to-r ${config.bgGradient} ${config.border}`}
            >
              <span className="text-2xl leading-none">{config.emoji}</span>
              <div>
                <div className={`text-xl font-bold tabular-nums ${config.text}`}>{count}</div>
                <div className="text-[10px] text-gray-500">{config.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
