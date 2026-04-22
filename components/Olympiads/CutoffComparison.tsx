'use client';

import { Olympiad } from '@/types';
import { getCutoffComparison, getComparisonMessage, MEDAL_CONFIG } from '@/utils/medals';

export function CutoffComparison({ olympiad }: { olympiad: Olympiad }) {
  const comparisons = getCutoffComparison(olympiad.hits, olympiad.cutoffs);

  if (comparisons.length === 0) {
    return (
      <p className="text-xs text-gray-600 italic">Nenhuma nota de corte registrada.</p>
    );
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">Comparação com cortes</p>
      <div className="space-y-1.5">
        {comparisons.map(({ medal, label, target, diff, status, color }) => {
          const config = MEDAL_CONFIG[medal];
          const bgColors = {
            above: 'bg-emerald-500/10 border-emerald-500/20',
            near: 'bg-yellow-500/10 border-yellow-500/20',
            below: 'bg-gray-800/40 border-gray-700/40',
          };

          return (
            <div
              key={medal}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border ${bgColors[status]}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{config.emoji}</span>
                <span className="text-xs text-gray-300">{label}</span>
                <span className="text-[10px] text-gray-600">corte: {target}</span>
              </div>
              <span className={`text-xs font-medium ${color}`}>
                {getComparisonMessage(diff, label.toLowerCase())}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
