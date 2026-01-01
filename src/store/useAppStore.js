import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),

      // Active module
      activeModule: 'weight',
      setActiveModule: (module) => set({ activeModule: module }),

      // Goal
      goalWeight: null,
      goalDate: null,
      setGoal: (weight, date) =>
        set({ goalWeight: weight, goalDate: date }),

      // Starting weight
      startingWeight: null,
      setStartingWeight: (weight) =>
        set({ startingWeight: parseFloat(weight) }),

      // Weight data
      weightData: [],

      addWeightEntry: (date, weight) => {
        const data = [
          ...get().weightData,
          { date, weight: parseFloat(weight) },
        ].sort((a, b) => new Date(a.date) - new Date(b.date));

        if (!get().startingWeight && data.length) {
          set({ startingWeight: data[0].weight });
        }

        set({ weightData: data });
      },

      deleteWeightEntry: (date) =>
        set({
          weightData: get().weightData.filter(
            (e) => e.date !== date
          ),
        }),

      // Psychology
      psychologyData: [],
      addPsychologyEntry: (entry) =>
        set({
          psychologyData: [
            ...get().psychologyData,
            entry,
          ].sort(
            (a, b) =>
              new Date(b.timestamp) -
              new Date(a.timestamp)
          ),
        }),

      // Streak
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        lastEntryDate: null,
      },

      updateStreak: () => {
        const today = new Date()
          .toISOString()
          .split('T')[0];
        const last = get().streakData.lastEntryDate;

        if (!last) {
          set({
            streakData: {
              currentStreak: 1,
              longestStreak: 1,
              lastEntryDate: today,
            },
          });
          return;
        }

        const diff =
          (new Date(today) - new Date(last)) /
          (1000 * 60 * 60 * 24);

        if (diff === 1) {
          const next =
            get().streakData.currentStreak + 1;
          set({
            streakData: {
              currentStreak: next,
              longestStreak: Math.max(
                next,
                get().streakData.longestStreak
              ),
              lastEntryDate: today,
            },
          });
        } else if (diff > 1) {
          set({
            streakData: {
              ...get().streakData,
              currentStreak: 1,
              lastEntryDate: today,
            },
          });
        }
      },

      // Analytics
      getCurrentWeight: () => {
        const d = get().weightData;
        return d.length ? d[d.length - 1].weight : 0;
      },

      getStartWeight: () =>
        get().startingWeight ||
        (get().weightData.length
          ? get().weightData[0].weight
          : 0),

      getTotalChange: () =>
        (
          get().getCurrentWeight() -
          get().getStartWeight()
        ).toFixed(1),
    }),
    {
      name: 'fitness-tracker-storage',
      partialize: (state) => ({
        theme: state.theme,
        weightData: state.weightData,
        psychologyData: state.psychologyData,
        streakData: state.streakData,
        startingWeight: state.startingWeight,
        goalWeight: state.goalWeight,
        goalDate: state.goalDate,
      }),
    }
  )
);

export default useAppStore;
