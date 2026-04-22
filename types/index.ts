export type MedalType = 'gold' | 'silver' | 'bronze' | 'honor' | 'none';

export interface Cutoffs {
  classification: number;
  honor: number;
  bronze: number;
  silver: number;
  gold: number;
}

export interface Olympiad {
  id: string;
  name: string;
  subject: string;
  hits: number;
  total: number;
  percentage: number;
  medal: MedalType;
  cutoffs: Cutoffs;
  date: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  name: string;
  date: string;
  description?: string;
  olympiadId?: string;
  color?: string;
  userId: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'medals' | 'performance' | 'streak' | 'special';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  totalOlympiads: number;
  averagePercentage: number;
  bestPercentage: number;
  worstPercentage: number;
  medals: Record<MedalType, number>;
  totalMedals: number;
  xp: number;
  level: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
}

export interface PredictionData {
  estimatedPercentage: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  medalProbabilities: Record<MedalType, number>;
  weaknesses: string[];
}

export interface ChartDataPoint {
  name: string;
  percentage: number;
  medal: MedalType;
  date: string;
  hits: number;
  total: number;
}

export interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface OlympiadFormData {
  name: string;
  subject: string;
  hits: number;
  total: number;
  date: string;
  notes?: string;
  cutoffs: Cutoffs;
}
