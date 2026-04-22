'use client';

import { useMemo } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, BarChart3, Target, Zap } from 'lucide-react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { ComparisonBarChart } from '@/components/Charts/ComparisonBarChart';
import { RadarPerformance } from '@/components/Charts/RadarPerformance';
import { useStore } from '@/store/useStore';
import { getMedalConfig } from '@/utils/medals';
import { formatDateShort, formatPercentage } from '@/utils/formatting';
import { getErrorAnalysis } from '@/utils/predictions';

export default function RankingPage() {
  const { olympiads, getStats } = useStore((s) => ({
    olympiads: s.olympiads,
    getStats: s.getStats,
  }));
  const stats = getStats();

  const ranked = useMemo(
    () => [...olympiads].sort((a, b) => b.percentage - a.percentage),
    [olympiads]
  );

  const sortedByDate = useMemo(
    () => [...olympiads].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [olympiads]
  );

  const evolution = useMemo(() => {
    if (sortedByDate.length < 2) return null;
    const first3 = sortedByDate.slice(0, 3);
    const last3 = sortedByDate.slice(-3);
    const firstAvg = first3.reduce((s, o) => s + o.percentage, 0) / first3.length;
    const lastAvg = last3.reduce((s, o) => s + o.percentage, 0) / last3.length;
    return { diff: lastAvg - firstAvg, recent: lastAvg, early: firstAvg };
  }, [sortedByDate]);

  const subjectStats = useMemo(() => {
    const map: Record<string, { total: number; sum: number }> = {};
    olympiads.forEach((o) => {
      const k = o.subject || 'Sem área';
      if (!map[k]) map[k] = { total: 0, sum: 0 };
      map[k].total += 1;
      map[k].sum += o.percentage;
    });
    return Object.entries(map)
      .map(([subject, { total, sum }]) => ({ subject, count: total, avg: sum / total }))
      .sort((a, b) => b.avg - a.avg);
  }, [olympiads]);

  return (
    <AppLayout title="Ranking & Estatísticas">
      <div className="space-y-6">
        {olympiads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <BarChart3 className="w-12 h-12 text-gray-700" />
            <p className="text-gray-500">Adicione olimpíadas para ver seu ranking.</p>
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Melhor', value: formatPercentage(stats.bestPercentage), sub: ranked[0]?.name, icon: '🥇', color: 'text-yellow-400' },
                { label: 'Pior', value: formatPercentage(stats.worstPercentage), sub: ranked[ranked.length - 1]?.name, icon: '📉', color: 'text-red-400' },
                { label: 'Média', value: formatPercentage(stats.averagePercentage), sub: `${stats.totalOlympiads} provas`, icon: '📊', color: 'text-blue-400' },
                { label: 'Total XP', value: stats.xp.toLocaleString(), sub: `Nível ${stats.level}`, icon: '⚡', color: 'text-violet-400' },
              ].map(({ label, value, sub, icon, color }) => (
                <div key={label} className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-4">
                  <span className="text-2xl">{icon}</span>
                  <div className={`text-2xl font-bold mt-2 ${color}`}>{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                  {sub && <div className="text-[10px] text-gray-600 mt-0.5 truncate">{sub}</div>}
                </div>
              ))}
            </div>

            {/* Evolution */}
            {evolution && (
              <div className={`flex items-center gap-4 p-4 rounded-2xl border ${
                evolution.diff >= 0
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-red-500/5 border-red-500/20'
              }`}>
                {evolution.diff > 0 ? (
                  <TrendingUp className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                ) : evolution.diff < 0 ? (
                  <TrendingDown className="w-8 h-8 text-red-400 flex-shrink-0" />
                ) : (
                  <Minus className="w-8 h-8 text-gray-400 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-semibold text-white">
                    {evolution.diff > 0 ? 'Evolução positiva! 🎉' : evolution.diff < 0 ? 'Tendência de queda' : 'Desempenho estável'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Início: {evolution.early.toFixed(1)}% → Recente: {evolution.recent.toFixed(1)}%
                    {' '}({evolution.diff > 0 ? '+' : ''}{evolution.diff.toFixed(1)}%)
                  </p>
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-violet-400" />
                  <h3 className="text-sm font-semibold text-white">Top Resultados</h3>
                </div>
                <ComparisonBarChart olympiads={olympiads} />
              </div>
              <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-violet-400" />
                  <h3 className="text-sm font-semibold text-white">Radar de Habilidades</h3>
                </div>
                <RadarPerformance olympiads={olympiads} />
              </div>
            </div>

            {/* Subject breakdown */}
            {subjectStats.length > 0 && (
              <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Desempenho por Área</h3>
                <div className="space-y-3">
                  {subjectStats.map(({ subject, count, avg }) => (
                    <div key={subject} className="flex items-center gap-3">
                      <span className="text-xs text-gray-300 w-28 truncate flex-shrink-0">{subject}</span>
                      <div className="flex-1 bg-gray-800 rounded-full h-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all"
                          style={{ width: `${avg}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-300 w-12 text-right">{avg.toFixed(1)}%</span>
                      <span className="text-xs text-gray-600 w-8 text-right">{count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full ranking table */}
            <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Ranking Completo</h3>
              <div className="space-y-2">
                {ranked.map((o, i) => {
                  const config = getMedalConfig(o.medal);
                  const errorAnalysis = getErrorAnalysis(o);
                  return (
                    <div
                      key={o.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${i === 0 ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-gray-800/30 border-gray-700/30'}`}
                    >
                      <span className="text-lg font-bold text-gray-600 w-6 text-center tabular-nums">
                        {i + 1}
                      </span>
                      <span className="text-xl flex-shrink-0">{config.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{o.name}</p>
                        <p className="text-xs text-gray-500">{formatDateShort(o.date)} · {o.hits}/{o.total}</p>
                      </div>
                      <span className={`text-xs font-medium ${errorAnalysis.color}`}>{errorAnalysis.label}</span>
                      <span className={`text-sm font-bold tabular-nums ${config.text}`}>{o.percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
