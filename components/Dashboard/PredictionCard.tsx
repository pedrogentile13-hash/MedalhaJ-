'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Brain } from 'lucide-react';
import { PredictionData } from '@/types';
import { MEDAL_CONFIG } from '@/utils/medals';

export function PredictionCard({ prediction }: { prediction: PredictionData | null }) {
  if (!prediction) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 min-h-[160px]"
      >
        <Brain className="w-8 h-8 text-gray-600" />
        <div className="text-center">
          <p className="text-sm text-gray-400">Previsão indisponível</p>
          <p className="text-xs text-gray-600 mt-1">Adicione pelo menos 2 olimpíadas</p>
        </div>
      </motion.div>
    );
  }

  const TrendIcon = prediction.trend === 'up' ? TrendingUp : prediction.trend === 'down' ? TrendingDown : Minus;
  const trendColor = prediction.trend === 'up' ? 'text-emerald-400' : prediction.trend === 'down' ? 'text-red-400' : 'text-gray-400';

  const topMedal = Object.entries(prediction.medalProbabilities)
    .sort(([, a], [, b]) => b - a)
    .filter(([, v]) => v > 0)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-900/60 border border-violet-500/10 rounded-2xl p-5 bg-gradient-to-br from-violet-600/5 to-transparent"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-violet-400" />
        <h3 className="text-sm font-semibold text-white">Previsão IA</h3>
        <span className="ml-auto text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/20">
          Beta
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-bold text-white tabular-nums">
            {prediction.estimatedPercentage}%
          </p>
          <p className="text-xs text-gray-500 mt-0.5">próximo resultado estimado</p>
        </div>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-5 h-5" />
          <span className="text-sm font-medium">
            {prediction.trendValue > 0 ? '+' : ''}{prediction.trendValue}%
          </span>
        </div>
      </div>

      {topMedal && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-800/40 mb-3">
          <span className="text-lg">{MEDAL_CONFIG[topMedal[0] as keyof typeof MEDAL_CONFIG]?.emoji}</span>
          <div>
            <p className="text-xs text-gray-300">Maior chance</p>
            <p className={`text-xs font-medium ${MEDAL_CONFIG[topMedal[0] as keyof typeof MEDAL_CONFIG]?.text}`}>
              {MEDAL_CONFIG[topMedal[0] as keyof typeof MEDAL_CONFIG]?.label} ({topMedal[1]}%)
            </p>
          </div>
        </div>
      )}

      {prediction.weaknesses.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-1.5">Pontos de atenção</p>
          {prediction.weaknesses.map((w, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-orange-400 mb-1">
              <span className="w-1 h-1 rounded-full bg-orange-400 flex-shrink-0" />
              {w}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
