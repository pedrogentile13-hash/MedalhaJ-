'use client';

import { useMemo } from 'react';
import { Trophy, TrendingUp, Target, Activity, BookOpen, Award } from 'lucide-react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { MedalCounter } from '@/components/Dashboard/MedalCounter';
import { GoalProgress } from '@/components/Dashboard/GoalProgress';
import { XPSystem } from '@/components/Dashboard/XPSystem';
import { PredictionCard } from '@/components/Dashboard/PredictionCard';
import { PerformanceLineChart } from '@/components/Charts/PerformanceLineChart';
import { MedalPieChart } from '@/components/Charts/MedalPieChart';
import { useStore } from '@/store/useStore';
import { calculatePrediction } from '@/utils/predictions';
import { formatPercentage } from '@/utils/formatting';

export default function DashboardPage() {
  const { olympiads, getStats } = useStore((s) => ({
    olympiads: s.olympiads,
    getStats: s.getStats,
  }));

  const stats = getStats();
  const prediction = useMemo(() => calculatePrediction(olympiads), [olympiads]);

  const sortedByDate = useMemo(
    () => [...olympiads].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [olympiads]
  );

  const trend = useMemo(() => {
    if (sortedByDate.length < 2) return null;
    const last = sortedByDate[sortedByDate.length - 1];
    const prev = sortedByDate[sortedByDate.length - 2];
    return { value: last.percentage - prev.percentage, label: 'vs anterior' };
  }, [sortedByDate]);

  return (
    <AppLayout title="Dashboard">
      {olympiads.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-6xl">🏆</div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Bem-vindo ao Dashboard Olímpico!</h2>
            <p className="text-gray-400 max-w-md">
              Comece adicionando suas olimpíadas para ver sua evolução, estatísticas e conquistas.
            </p>
          </div>
          <a
            href="/olympiads"
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Trophy className="w-4 h-4" />
            Adicionar Olimpíada
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatsCard
              title="Total de Provas"
              value={stats.totalOlympiads}
              icon={BookOpen}
              color="purple"
              delay={0}
            />
            <StatsCard
              title="Medalhas"
              value={stats.totalMedals}
              subtitle={`${stats.medals.gold} 🥇 ${stats.medals.silver} 🥈 ${stats.medals.bronze} 🥉`}
              icon={Trophy}
              color="gold"
              delay={0.05}
            />
            <StatsCard
              title="Média Geral"
              value={formatPercentage(stats.averagePercentage)}
              icon={TrendingUp}
              color="green"
              trend={trend ?? undefined}
              delay={0.1}
            />
            <StatsCard
              title="Melhor Resultado"
              value={formatPercentage(stats.bestPercentage)}
              icon={Award}
              color="blue"
              delay={0.15}
            />
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <XPSystem stats={stats} />
            <MedalCounter stats={stats} />
            <GoalProgress />
            <PredictionCard prediction={prediction} />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white">Evolução de Desempenho</h3>
              </div>
              <PerformanceLineChart olympiads={sortedByDate} />
            </div>
            <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white">Distribuição de Medalhas</h3>
              </div>
              <MedalPieChart stats={stats} />
            </div>
          </div>

          {/* Recent olympiads */}
          <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Últimas Olimpíadas</h3>
            <div className="space-y-2">
              {[...olympiads].slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30"
                >
                  <span className="text-xl">
                    {o.medal === 'gold' ? '🥇' : o.medal === 'silver' ? '🥈' : o.medal === 'bronze' ? '🥉' : o.medal === 'honor' ? '🏅' : '📜'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{o.name}</p>
                    <p className="text-xs text-gray-500">{o.hits}/{o.total} acertos</p>
                  </div>
                  <span className="text-sm font-bold text-white tabular-nums">{o.percentage}%</span>
                </div>
              ))}
            </div>
            {olympiads.length > 5 && (
              <a href="/olympiads" className="block text-center text-xs text-violet-400 hover:text-violet-300 mt-3 transition-colors">
                Ver todas as {olympiads.length} olimpíadas →
              </a>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
