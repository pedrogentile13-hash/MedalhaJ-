import { MedalType, Cutoffs, OlympiadType } from '@/types';

// ─── Tipo de olimpíada ────────────────────────────────────────────────────────

export const TYPE_CONFIG: Record<OlympiadType, {
  label: string;
  emoji: string;
  description: string;
  text: string;
  bg: string;
  border: string;
}> = {
  olimpiada: {
    label: 'Olímpiada',
    emoji: '🏆',
    description: 'Valendo medalha',
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
  },
  classificatoria: {
    label: 'Classificatória',
    emoji: '📋',
    description: 'Fase eliminatória / sem medalha',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  simulado: {
    label: 'Simulado',
    emoji: '📝',
    description: 'Treino / prática',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
};

export function getTypeConfig(type: OlympiadType) {
  return TYPE_CONFIG[type];
}

// ─── Medalhas ─────────────────────────────────────────────────────────────────

export function calculateMedal(hits: number, cutoffs: Cutoffs, type: OlympiadType): MedalType {
  if (type !== 'olimpiada') return 'none';
  if (!cutoffs || cutoffs.gold === 0) return 'none';
  if (hits >= cutoffs.gold)   return 'gold';
  if (hits >= cutoffs.silver) return 'silver';
  if (hits >= cutoffs.bronze) return 'bronze';
  if (hits >= cutoffs.honor)  return 'honor';
  return 'none';
}

export function calculateClassified(hits: number, cutoffs: Cutoffs): boolean | undefined {
  if (!cutoffs || cutoffs.classification === 0) return undefined;
  return hits >= cutoffs.classification;
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

// ─── Comparação com cortes ────────────────────────────────────────────────────

export interface CutoffRow {
  key: string;
  label: string;
  emoji: string;
  target: number;
  diff: number;
  status: 'above' | 'near' | 'below';
  colorText: string;
  colorBg: string;
  colorBorder: string;
  isClassification: boolean;
}

export function getCutoffComparison(hits: number, cutoffs: Cutoffs): CutoffRow[] {
  const rows: CutoffRow[] = [];

  // Classificação — sempre primeiro, com destaque especial
  if (cutoffs.classification > 0) {
    const diff = hits - cutoffs.classification;
    const status = diff >= 0 ? 'above' : Math.abs(diff) <= 3 ? 'near' : 'below';
    rows.push({
      key: 'classification',
      label: 'Classificação',
      emoji: '📋',
      target: cutoffs.classification,
      diff,
      status,
      colorText:   status === 'above' ? 'text-emerald-400' : status === 'near' ? 'text-yellow-400' : 'text-red-400',
      colorBg:     status === 'above' ? 'bg-emerald-500/10' : status === 'near' ? 'bg-yellow-500/10' : 'bg-red-500/10',
      colorBorder: status === 'above' ? 'border-emerald-500/25' : status === 'near' ? 'border-yellow-500/25' : 'border-red-500/25',
      isClassification: true,
    });
  }

  // Medalhas
  const medals: Array<{ key: string; label: string; emoji: string; target: number }> = [
    { key: 'gold',   label: 'Ouro',           emoji: '🥇', target: cutoffs.gold },
    { key: 'silver', label: 'Prata',          emoji: '🥈', target: cutoffs.silver },
    { key: 'bronze', label: 'Bronze',         emoji: '🥉', target: cutoffs.bronze },
    { key: 'honor',  label: 'Honra ao Mérito',emoji: '🏅', target: cutoffs.honor },
  ];

  for (const { key, label, emoji, target } of medals) {
    if (target === 0) continue;
    const diff = hits - target;
    const status = diff >= 0 ? 'above' : Math.abs(diff) <= 3 ? 'near' : 'below';
    rows.push({
      key, label, emoji, target, diff, status,
      colorText:   status === 'above' ? 'text-emerald-400' : status === 'near' ? 'text-yellow-400' : 'text-gray-500',
      colorBg:     status === 'above' ? 'bg-emerald-500/8' : status === 'near' ? 'bg-yellow-500/8' : 'bg-gray-800/30',
      colorBorder: status === 'above' ? 'border-emerald-500/20' : status === 'near' ? 'border-yellow-500/20' : 'border-gray-700/30',
      isClassification: false,
    });
  }

  return rows;
}

export function getCutoffMessage(diff: number, label: string, isClassification = false): string {
  const target = isClassification ? `para classificar` : `para ${label.toLowerCase()}`;
  if (diff >= 0)  return `+${diff} acima do corte`;
  if (diff === -1) return `faltou 1 questão ${target}`;
  return `faltou ${Math.abs(diff)} questões ${target}`;
}
