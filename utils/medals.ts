import { MedalType, Cutoffs } from '@/types';

export function calculateMedal(hits: number, cutoffs: Cutoffs): MedalType {
  if (!cutoffs || cutoffs.gold === 0) return 'none';
  if (hits >= cutoffs.gold) return 'gold';
  if (hits >= cutoffs.silver) return 'silver';
  if (hits >= cutoffs.bronze) return 'bronze';
  if (hits >= cutoffs.honor) return 'honor';
  return 'none';
}

export const MEDAL_CONFIG: Record<MedalType, {
  label: string;
  emoji: string;
  color: string;
  bgGradient: string;
  border: string;
  text: string;
  glow: string;
}> = {
  gold: {
    label: 'Ouro',
    emoji: '🥇',
    color: '#fbbf24',
    bgGradient: 'from-yellow-500/20 via-yellow-600/10 to-transparent',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]',
  },
  silver: {
    label: 'Prata',
    emoji: '🥈',
    color: '#94a3b8',
    bgGradient: 'from-slate-400/20 via-slate-500/10 to-transparent',
    border: 'border-slate-400/40',
    text: 'text-slate-300',
    glow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]',
  },
  bronze: {
    label: 'Bronze',
    emoji: '🥉',
    color: '#b45309',
    bgGradient: 'from-amber-700/20 via-amber-800/10 to-transparent',
    border: 'border-amber-700/40',
    text: 'text-amber-600',
    glow: 'shadow-[0_0_15px_rgba(180,83,9,0.3)]',
  },
  honor: {
    label: 'Honra ao Mérito',
    emoji: '🏅',
    color: '#a855f7',
    bgGradient: 'from-purple-600/20 via-purple-700/10 to-transparent',
    border: 'border-purple-600/40',
    text: 'text-purple-400',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
  },
  none: {
    label: 'Participação',
    emoji: '📜',
    color: '#6b7280',
    bgGradient: 'from-gray-600/20 via-gray-700/10 to-transparent',
    border: 'border-gray-600/40',
    text: 'text-gray-500',
    glow: '',
  },
};

export function getMedalConfig(medal: MedalType) {
  return MEDAL_CONFIG[medal];
}

export function getCutoffComparison(hits: number, cutoffs: Cutoffs) {
  const comparisons: Array<{
    medal: MedalType;
    label: string;
    target: number;
    diff: number;
    status: 'above' | 'near' | 'below';
    color: string;
  }> = [];

  const targets: Array<{ medal: MedalType; label: string; target: number }> = [
    { medal: 'gold', label: 'Ouro', target: cutoffs.gold },
    { medal: 'silver', label: 'Prata', target: cutoffs.silver },
    { medal: 'bronze', label: 'Bronze', target: cutoffs.bronze },
    { medal: 'honor', label: 'Honra ao Mérito', target: cutoffs.honor },
  ];

  for (const { medal, label, target } of targets) {
    if (target === 0) continue;
    const diff = hits - target;
    let status: 'above' | 'near' | 'below';
    let color: string;

    if (diff >= 0) {
      status = 'above';
      color = 'text-emerald-400';
    } else if (Math.abs(diff) <= 3) {
      status = 'near';
      color = 'text-yellow-400';
    } else {
      status = 'below';
      color = 'text-red-400';
    }

    comparisons.push({ medal, label, target, diff, status, color });
  }

  return comparisons;
}

export function getComparisonMessage(diff: number, label: string): string {
  if (diff >= 0) return `+${diff} acima do corte ${label}`;
  if (diff === -1) return `faltou 1 questão para ${label}`;
  return `faltou ${Math.abs(diff)} questões para ${label}`;
}
