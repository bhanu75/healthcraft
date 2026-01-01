import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),

      // Active module
      activeModule: 'weight',
      setActiveModule: (module) => set({ activeModule: module }),

      // Goal settings
      goalWeight: null,
      goalDate: null,
      setGoal: (weight, date) => set({ goalWeight: weight, goalDate: date }),

      // Starting weight (user sets this)
      startingWeight: null,
      setStartingWeight: (weight) => set({ startingWeight: parseFloat(weight) }),

      // Weight tracking data
      weightData: [],

      addWeightEntry: (date, weight) => {
        const newData = [...get().weightData, { date, weight: parseFloat(weight) }]
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Set starting weight if not set
        if (!get().startingWeight && newData.length > 0) {
          set({ startingWeight: newData[0].weight });
        }
        
        set({ weightData: newData });
      },

      deleteWeightEntry: (date) => {
        const filtered = get().weightData.filter(entry => entry.date !== date);
        set({ weightData: filtered });
      },

      // Psychology data
      psychologyData: [],
      
      addPsychologyEntry: (entry) => {
        const newData = [...get().psychologyData, entry]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        set({ psychologyData: newData });
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
              longestStreak: Math.max(newStreak, get().streakData.longestStreak),
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
      getCurrentWeight: () => {
        const data = get().weightData;
        return data.length > 0 ? data[data.length - 1].weight : 0;
      },

      getStartWeight: () => {
        return get().startingWeight || (get().weightData.length > 0 ? get().weightData[0].weight : 0);
      },

      getTotalChange: () => {
        const current = get().getCurrentWeight();
        const start = get().getStartWeight();
        return (current - start).toFixed(1);
      },

      getChangePercentage: () => {
        const start = get().getStartWeight();
        if (start === 0) return 0;
        const change = get().getTotalChange();
        return ((change / start) * 100).toFixed(1);
      },

      getWeeklyChange: () => {
        const data = get().weightData;
        if (data.length < 2) return 0;
        const latest = data[data.length - 1].weight;
        const weekAgo = data[Math.max(0, data.length - 8)].weight;
        return (latest - weekAgo).toFixed(1);
      },

      getMonthlyChange: () => {
        const data = get().weightData;
        if (data.length < 2) return 0;
        const latest = data[data.length - 1].weight;
        
        // Find entry from ~30 days ago
        const latestDate = new Date(data[data.length - 1].date);
        const monthAgo = new Date(latestDate);
        monthAgo.setDate(monthAgo.getDate() - 30);
        
        let closestEntry = data[0];
        for (const entry of data) {
          if (new Date(entry.date) <= monthAgo) {
            closestEntry = entry;
          }
        }
        
        return (latest - closestEntry.weight).toFixed(1);
      },

      getAverageWeightLoss: () => {
        const data = get().weightData;
        if (data.length < 2) return 0;
        const totalChange = get().getTotalChange();
        const daysDiff = Math.floor(
          (new Date(data[data.length - 1].date) - new Date(data[0].date)) / 
          (1000 * 60 * 60 * 24)
        );
        return daysDiff > 0 ? (totalChange / daysDiff * 7).toFixed(2) : 0;
      },

      getGoalProgress: () => {
        const goal = get().goalWeight;
        const start = get().getStartWeight();
        const current = get().getCurrentWeight();
        
        if (!goal || start === current) return 0;
        
        const totalNeeded = goal - start;
        const achieved = current - start;
        
        return Math.min(100, Math.max(0, (achieved / totalNeeded) * 100)).toFixed(1);
      },
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

export default useAppStore;        set({ psychologyData: [...get().psychologyData, entry] });
      },

  
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
