import { Achievement, UserStats } from '@/types';

type AchievementDef = Omit<Achievement, 'unlocked' | 'unlockedAt'> & {
  condition: (stats: UserStats) => boolean;
};

export const ACHIEVEMENT_DEFINITIONS: AchievementDef[] = [
  {
    id: 'first_step',
    name: 'Primeiro Passo',
    description: 'Registrou sua primeira olimpíada',
    icon: '🚀',
    category: 'special',
    xpReward: 100,
    condition: (s) => s.totalOlympiads >= 1,
  },
  {
    id: 'five_olympiads',
    name: 'Atleta em Formação',
    description: 'Participou de 5 olimpíadas',
    icon: '🏃',
    category: 'special',
    xpReward: 250,
    condition: (s) => s.totalOlympiads >= 5,
  },
  {
    id: 'ten_olympiads',
    name: 'Veterano',
    description: 'Participou de 10 olimpíadas',
    icon: '⚔️',
    category: 'special',
    xpReward: 500,
    condition: (s) => s.totalOlympiads >= 10,
  },
  {
    id: 'twenty_olympiads',
    name: 'Lendário',
    description: 'Participou de 20 olimpíadas',
    icon: '🏆',
    category: 'special',
    xpReward: 1000,
    condition: (s) => s.totalOlympiads >= 20,
  },
  {
    id: 'first_gold',
    name: 'Ouro Puro',
    description: 'Conquistou primeira medalha de ouro',
    icon: '🥇',
    category: 'medals',
    xpReward: 500,
    condition: (s) => s.medals.gold >= 1,
  },
  {
    id: 'three_golds',
    name: 'Campeão',
    description: 'Conquistou 3 medalhas de ouro',
    icon: '👑',
    category: 'medals',
    xpReward: 1000,
    condition: (s) => s.medals.gold >= 3,
  },
  {
    id: 'first_silver',
    name: 'Prata Brilhante',
    description: 'Conquistou primeira medalha de prata',
    icon: '🥈',
    category: 'medals',
    xpReward: 300,
    condition: (s) => s.medals.silver >= 1,
  },
  {
    id: 'first_bronze',
    name: 'Bronze Guerreiro',
    description: 'Conquistou primeira medalha de bronze',
    icon: '🥉',
    category: 'medals',
    xpReward: 200,
    condition: (s) => s.medals.bronze >= 1,
  },
  {
    id: 'five_medals',
    name: 'Colecionador',
    description: 'Conquistou 5 medalhas (qualquer tipo)',
    icon: '🎖️',
    category: 'medals',
    xpReward: 750,
    condition: (s) => s.totalMedals >= 5,
  },
  {
    id: 'ten_medals',
    name: 'Grande Atleta',
    description: 'Conquistou 10 medalhas',
    icon: '🌟',
    category: 'medals',
    xpReward: 1500,
    condition: (s) => s.totalMedals >= 10,
  },
  {
    id: 'avg_70',
    name: 'Sólido',
    description: 'Média acima de 70%',
    icon: '📈',
    category: 'performance',
    xpReward: 300,
    condition: (s) => s.averagePercentage >= 70,
  },
  {
    id: 'avg_80',
    name: 'Alta Performance',
    description: 'Média acima de 80%',
    icon: '⚡',
    category: 'performance',
    xpReward: 600,
    condition: (s) => s.averagePercentage >= 80,
  },
  {
    id: 'avg_90',
    name: 'Elite',
    description: 'Média acima de 90%',
    icon: '💎',
    category: 'performance',
    xpReward: 1200,
    condition: (s) => s.averagePercentage >= 90,
  },
  {
    id: 'perfect_score',
    name: 'Perfeição',
    description: 'Atingiu 100% em uma olimpíada',
    icon: '💯',
    category: 'performance',
    xpReward: 2000,
    condition: (s) => s.bestPercentage >= 100,
  },
  {
    id: 'level_5',
    name: 'Nível 5',
    description: 'Alcançou o nível 5',
    icon: '⭐',
    category: 'special',
    xpReward: 500,
    condition: (s) => s.level >= 5,
  },
  {
    id: 'level_10',
    name: 'Nível 10',
    description: 'Alcançou o nível 10',
    icon: '🌠',
    category: 'special',
    xpReward: 1000,
    condition: (s) => s.level >= 10,
  },
];

export function evaluateAchievements(
  stats: UserStats,
  alreadyUnlocked: string[]
): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    const wasUnlocked = alreadyUnlocked.includes(def.id);
    const isNowUnlocked = def.condition(stats);
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      category: def.category,
      xpReward: def.xpReward,
      unlocked: isNowUnlocked,
      unlockedAt:
        isNowUnlocked && !wasUnlocked ? new Date().toISOString() : undefined,
    };
  });
}

export function calculateXP(olympiads: { medal: string; percentage: number }[]): number {
  return olympiads.reduce((xp, o) => {
    let earned = 50;
    if (o.medal === 'gold') earned += 200;
    else if (o.medal === 'silver') earned += 150;
    else if (o.medal === 'bronze') earned += 100;
    else if (o.medal === 'honor') earned += 75;
    if (o.percentage >= 90) earned += 100;
    else if (o.percentage >= 80) earned += 50;
    else if (o.percentage >= 70) earned += 25;
    return xp + earned;
  }, 0);
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 100;
}

export function xpForNextLevel(level: number): number {
  return level * level * 100;
}
