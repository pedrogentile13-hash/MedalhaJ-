import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Olympiad,
  CalendarEvent,
  User,
  UserStats,
  Achievement,
  OlympiadFormData,
  MedalType,
} from '@/types';
import { calculateMedal } from '@/utils/medals';
import {
  calculateXP,
  calculateLevel,
  xpForLevel,
  xpForNextLevel,
  evaluateAchievements,
} from '@/utils/achievements';

interface StoreState {
  olympiads: Olympiad[];
  events: CalendarEvent[];
  user: User | null;
  goal: number;
  isLoading: boolean;
  unlockedAchievementIds: string[];

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setGoal: (goal: number) => void;

  addOlympiad: (data: OlympiadFormData) => Olympiad;
  updateOlympiad: (id: string, data: Partial<OlympiadFormData>) => void;
  deleteOlympiad: (id: string) => void;
  setOlympiads: (olympiads: Olympiad[]) => void;

  addEvent: (data: Omit<CalendarEvent, 'id' | 'userId' | 'createdAt'>) => void;
  updateEvent: (id: string, data: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setEvents: (events: CalendarEvent[]) => void;

  unlockAchievement: (id: string) => void;

  getStats: () => UserStats;
  getAchievements: () => Achievement[];
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      olympiads: [],
      events: [],
      user: null,
      goal: 5,
      isLoading: false,
      unlockedAchievementIds: [],

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setGoal: (goal) => set({ goal }),

      addOlympiad: (data) => {
        const userId = get().user?.uid || 'local';
        const percentage =
          data.total > 0 ? Math.round((data.hits / data.total) * 1000) / 10 : 0;
        const medal = calculateMedal(data.hits, data.cutoffs);
        const now = new Date().toISOString();
        const olympiad: Olympiad = {
          id: crypto.randomUUID(),
          ...data,
          percentage,
          medal,
          userId,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ olympiads: [olympiad, ...state.olympiads] }));

        const stats = get().getStats();
        const newUnlocked = evaluateAchievements(stats, get().unlockedAchievementIds)
          .filter((a) => a.unlocked && !get().unlockedAchievementIds.includes(a.id))
          .map((a) => a.id);
        if (newUnlocked.length > 0) {
          set((state) => ({
            unlockedAchievementIds: [...state.unlockedAchievementIds, ...newUnlocked],
          }));
        }

        return olympiad;
      },

      updateOlympiad: (id, data) => {
        set((state) => ({
          olympiads: state.olympiads.map((o) => {
            if (o.id !== id) return o;
            const updated = { ...o, ...data, updatedAt: new Date().toISOString() };
            const cutoffs = data.cutoffs ?? o.cutoffs;
            const hits = data.hits ?? o.hits;
            const total = data.total ?? o.total;
            const percentage = total > 0 ? Math.round((hits / total) * 1000) / 10 : 0;
            const medal = calculateMedal(hits, cutoffs);
            return { ...updated, percentage, medal, cutoffs };
          }),
        }));
      },

      deleteOlympiad: (id) =>
        set((state) => ({ olympiads: state.olympiads.filter((o) => o.id !== id) })),

      setOlympiads: (olympiads) => set({ olympiads }),

      addEvent: (data) => {
        const userId = get().user?.uid || 'local';
        const event: CalendarEvent = {
          id: crypto.randomUUID(),
          ...data,
          userId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ events: [...state.events, event] }));
      },

      updateEvent: (id, data) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      deleteEvent: (id) =>
        set((state) => ({ events: state.events.filter((e) => e.id !== id) })),

      setEvents: (events) => set({ events }),

      unlockAchievement: (id) =>
        set((state) => ({
          unlockedAchievementIds: state.unlockedAchievementIds.includes(id)
            ? state.unlockedAchievementIds
            : [...state.unlockedAchievementIds, id],
        })),

      getStats: () => {
        const { olympiads } = get();
        if (olympiads.length === 0) {
          const level = 1;
          return {
            totalOlympiads: 0,
            averagePercentage: 0,
            bestPercentage: 0,
            worstPercentage: 0,
            medals: { gold: 0, silver: 0, bronze: 0, honor: 0, none: 0 },
            totalMedals: 0,
            xp: 0,
            level,
            xpForCurrentLevel: xpForLevel(level),
            xpForNextLevel: xpForNextLevel(level),
          };
        }

        const percentages = olympiads.map((o) => o.percentage);
        const avg = percentages.reduce((a, b) => a + b, 0) / olympiads.length;
        const medals = olympiads.reduce(
          (acc, o) => ({ ...acc, [o.medal]: (acc[o.medal] || 0) + 1 }),
          { gold: 0, silver: 0, bronze: 0, honor: 0, none: 0 } as Record<MedalType, number>
        );
        const totalMedals = medals.gold + medals.silver + medals.bronze + medals.honor;
        const xp = calculateXP(olympiads);
        const level = calculateLevel(xp);

        return {
          totalOlympiads: olympiads.length,
          averagePercentage: Math.round(avg * 10) / 10,
          bestPercentage: Math.max(...percentages),
          worstPercentage: Math.min(...percentages),
          medals,
          totalMedals,
          xp,
          level,
          xpForCurrentLevel: xpForLevel(level),
          xpForNextLevel: xpForNextLevel(level),
        };
      },

      getAchievements: () => {
        const stats = get().getStats();
        return evaluateAchievements(stats, get().unlockedAchievementIds);
      },
    }),
    {
      name: 'olympic-dashboard-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
