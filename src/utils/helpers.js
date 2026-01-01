import { format, parseISO, differenceInDays } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merger utility
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Date formatting
export const formatDate = (dateString, formatStr = 'dd MMM yyyy') => {
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    return dateString;
  }
};

export const formatShortDate = (dateString) => {
  return formatDate(dateString, 'dd MMM');
};

export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Weight calculations
export const calculateBMI = (weight, heightInCm) => {
  const heightInM = heightInCm / 100;
  return (weight / (heightInM * heightInM)).toFixed(1);
};

export const getWeightChangePercentage = (current, start) => {
  if (start === 0) return 0;
  return (((current - start) / start) * 100).toFixed(1);
};

// Streak calculations
export const calculateStreak = (dates) => {
  if (dates.length === 0) return 0;
  
  const sortedDates = [...dates].sort((a, b) => new Date(b) - new Date(a));
  let streak = 1;
  
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = differenceInDays(
      parseISO(sortedDates[i]),
      parseISO(sortedDates[i + 1])
    );
    
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Celebration triggers
export const shouldCelebrate = (streak) => {
  const milestones = [7, 14, 21, 30, 60, 90, 180, 365];
  return milestones.includes(streak);
};

export const getCelebrationMessage = (streak) => {
  const messages = {
    7: "🎉 Amazing! 7 days strong!",
    14: "🔥 Two weeks! You're unstoppable!",
    21: "⭐ 3 weeks! You've built a habit!",
    30: "🏆 One month milestone! Incredible!",
    60: "💪 60 days! You're a champion!",
    90: "🌟 90 days! Elite level commitment!",
    180: "🎯 Half a year! Absolutely legendary!",
    365: "👑 ONE YEAR! You're an inspiration!",
  };
  return messages[streak] || `🎊 ${streak} days! Keep going!`;
};

// Color utilities based on progress
export const getProgressColor = (value, isPositive = false) => {
  if (value === 0) return 'text-gray-500';
  if (isPositive) {
    return value > 0 ? 'text-green-500' : 'text-red-500';
  }
  return value < 0 ? 'text-green-500' : 'text-red-500';
};

export const getProgressBgColor = (value, isPositive = false) => {
  if (value === 0) return 'bg-gray-100';
  if (isPositive) {
    return value > 0 ? 'bg-green-100' : 'bg-red-100';
  }
  return value < 0 ? 'bg-green-100' : 'bg-red-100';
};

// Data validation
export const isValidWeight = (weight) => {
  const w = parseFloat(weight);
  return !isNaN(w) && w > 0 && w < 500;
};

export const isValidDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  } catch {
    return false;
  }
};
