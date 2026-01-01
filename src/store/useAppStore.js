// File - src/store/useAppStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // Active module state
      activeModule: 'weight',
      setActiveModule: (module) => set({ activeModule: module }),

      // Weight tracking data (user will add starting weight)
      weightData: [],

      addWeightEntry: (date, weight) => {
        const newEntry = { date, weight: parseFloat(weight) };

        const newData = [...get().weightData, newEntry].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        set({ weightData: newData });
      },

      deleteWeightEntry: (date) => {
        const filtered = get().weightData.filter(
          (entry) => entry.date !== date
        );
        set({ weightData: filtered });
      },

      // Psychology data
      psychologyData: [],

      addPsychologyEntry: (entry) => {
        set({ psychologyData: [...get().psychologyData, entry] });
      },

      // Streak data
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        lastEntryDate: null,
      },

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = get().streakData.lastEntryDate;

        if (!lastDate) {
          set({
            streakData: {
              currentStreak: 1,
              longestStreak: 1,
              lastEntryDate: today,
            },
          });
          return;
        }

        const daysDiff = Math.floor(
          (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          const newStreak = get().streakData.currentStreak + 1;
          set({
            streakData: {
              currentStreak: newStreak,
              longestStreak: Math.max(
                newStreak,
                get().streakData.longestStreak
              ),
              lastEntryDate: today,
            },
          });
        } else if (daysDiff > 1) {
          set({
            streakData: {
              ...get().streakData,
              currentStreak: 1,
              lastEntryDate: today,
            },
          });
        }
      },

      // Analytics calculations
      getWeeklyChange: () => {
        const data = get().weightData;
        if (data.length < 2) return 0;

        const latest = data[data.length - 1].weight;
        const weekAgoIndex = Math.max(0, data.length - 8);
        const weekAgo = data[weekAgoIndex].weight;

        return (latest - weekAgo).toFixed(1);
      },

      getMonthlyChange: () => {
        const data = get().weightData;
        if (data.length < 2) return 0;

        const latest = data[data.length - 1].weight;
        const monthAgo = data[0].weight;

        return (latest - monthAgo).toFixed(1);
      },

      getAverageWeightLoss: () => {
        const data = get().weightData;
        if (data.length < 2) return 0;

        const totalChange =
          data[data.length - 1].weight - data[0].weight;

        const daysDiff = Math.floor(
          (new Date(data[data.length - 1].date) -
            new Date(data[0].date)) /
            (1000 * 60 * 60 * 24)
        );

        return daysDiff > 0
          ? ((totalChange / daysDiff) * 7).toFixed(2)
          : 0;
      },
    }),
    {
      name: 'fitness-tracker-storage',
      partialize: (state) => ({
        weightData: state.weightData,
        psychologyData: state.psychologyData,
        streakData: state.streakData,
      }),
    }
  )
);

export default useAppStore;
