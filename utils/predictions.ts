import { Olympiad, PredictionData, MedalType } from '@/types';

export function calculatePrediction(olympiads: Olympiad[]): PredictionData | null {
  if (olympiads.length < 2) return null;

  const sorted = [...olympiads].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const percentages = sorted.map((o) => o.percentage);

  const n = percentages.length;
  const sumX = Array.from({ length: n }, (_, i) => i).reduce((a, b) => a + b, 0);
  const sumY = percentages.reduce((a, b) => a + b, 0);
  const sumXY = percentages.reduce((s, p, i) => s + i * p, 0);
  const sumX2 = Array.from({ length: n }, (_, i) => i * i).reduce((a, b) => a + b, 0);

  const denom = n * sumX2 - sumX * sumX;
  const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
  const intercept = (sumY - slope * sumX) / n;

  const nextExpected = Math.min(100, Math.max(0, slope * n + intercept));

  const recent = percentages.slice(-3);
  const prev = percentages.slice(-6, -3);
  const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
  const avgPrev = prev.length > 0 ? prev.reduce((a, b) => a + b, 0) / prev.length : avgRecent;
  const trendValue = avgRecent - avgPrev;
  const trend: 'up' | 'down' | 'stable' =
    trendValue > 1.5 ? 'up' : trendValue < -1.5 ? 'down' : 'stable';

  const medalCounts = olympiads.reduce(
    (acc, o) => ({ ...acc, [o.medal]: (acc[o.medal] || 0) + 1 }),
    {} as Record<string, number>
  );
  const total = olympiads.length;
  const medalProbabilities: Record<MedalType, number> = {
    gold: Math.round(((medalCounts.gold || 0) / total) * 100),
    silver: Math.round(((medalCounts.silver || 0) / total) * 100),
    bronze: Math.round(((medalCounts.bronze || 0) / total) * 100),
    honor: Math.round(((medalCounts.honor || 0) / total) * 100),
    none: Math.round(((medalCounts.none || 0) / total) * 100),
  };

  const weaknesses = detectWeaknesses(olympiads);

  return {
    estimatedPercentage: Math.round(nextExpected * 10) / 10,
    trend,
    trendValue: Math.round(trendValue * 10) / 10,
    medalProbabilities,
    weaknesses,
  };
}

function detectWeaknesses(olympiads: Olympiad[]): string[] {
  const weaknesses: string[] = [];

  const subjectGroups = olympiads.reduce(
    (acc, o) => {
      if (!acc[o.subject]) acc[o.subject] = [];
      acc[o.subject].push(o.percentage);
      return acc;
    },
    {} as Record<string, number[]>
  );

  for (const [subject, scores] of Object.entries(subjectGroups)) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg < 60 && scores.length >= 2) {
      weaknesses.push(`${subject} (média: ${avg.toFixed(0)}%)`);
    }
  }

  const recentPerformances = [...olympiads]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  const recentAvg =
    recentPerformances.reduce((a, b) => a + b.percentage, 0) / (recentPerformances.length || 1);
  if (recentAvg < 55) {
    weaknesses.push('Queda de desempenho recente');
  }

  return weaknesses.slice(0, 3);
}

export function getErrorAnalysis(olympiad: Olympiad) {
  const errors = olympiad.total - olympiad.hits;
  const errorRate = (errors / olympiad.total) * 100;

  if (errorRate <= 10) return { level: 'excellent', label: 'Excelente', color: 'text-emerald-400' };
  if (errorRate <= 25) return { level: 'good', label: 'Bom', color: 'text-blue-400' };
  if (errorRate <= 40) return { level: 'average', label: 'Regular', color: 'text-yellow-400' };
  if (errorRate <= 55) return { level: 'poor', label: 'Abaixo da Média', color: 'text-orange-400' };
  return { level: 'critical', label: 'Crítico', color: 'text-red-400' };
}
