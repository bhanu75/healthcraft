import React, { useState } from 'react';
import { Calendar as CalendarIcon, Flame, Trophy, Award } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import Confetti from 'react-confetti';
import { shouldCelebrate, getCelebrationMessage } from '../../utils/helpers';

const Calendar = () => {
  const { streakData, updateStreak } = useAppStore();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCheckIn = () => {
    updateStreak();
    
    if (shouldCelebrate(streakData.currentStreak + 1)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const milestones = [
    { days: 7, label: '1 Week', icon: '🎯', achieved: streakData.longestStreak >= 7 },
    { days: 14, label: '2 Weeks', icon: '🔥', achieved: streakData.longestStreak >= 14 },
    { days: 30, label: '1 Month', icon: '⭐', achieved: streakData.longestStreak >= 30 },
    { days: 60, label: '2 Months', icon: '💪', achieved: streakData.longestStreak >= 60 },
    { days: 90, label: '3 Months', icon: '🏆', achieved: streakData.longestStreak >= 90 },
    { days: 180, label: '6 Months', icon: '👑', achieved: streakData.longestStreak >= 180 },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-orange-500" />
            Streak Calendar
          </h1>
          <p className="text-sm text-base-content/60">Build consistent habits</p>
        </div>
      </div>

      {/* Main Streak Card */}
      <div className="card bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl">
        <div className="card-body items-center text-center">
          <div className="text-7xl mb-4 animate-pulse">
            <Flame className="w-20 h-20 mx-auto" />
          </div>
          <div className="text-6xl font-bold mb-2">
            {streakData.currentStreak}
          </div>
          <p className="text-xl opacity-90 mb-6">Day Streak 🔥</p>
          
          <button 
            onClick={handleCheckIn}
            className="btn btn-lg btn-wide bg-white text-orange-600 hover:bg-orange-50 border-none"
          >
            Check In Today
          </button>

          <div className="mt-6 grid grid-cols-2 gap-4 w-full">
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm opacity-80">Longest Streak</p>
              <p className="text-2xl font-bold">{streakData.longestStreak}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm opacity-80">Last Check-in</p>
              <p className="text-sm font-bold">
                {streakData.lastEntryDate 
                  ? new Date(streakData.lastEntryDate).toLocaleDateString()
                  : 'Not yet'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Milestones</h2>
          <div className="grid grid-cols-2 gap-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.days}
                className={`card ${
                  milestone.achieved 
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                    : 'bg-base-200'
                } shadow`}
              >
                <div className="card-body p-4 items-center text-center">
                  <div className={`text-3xl mb-2 ${
                    milestone.achieved ? 'animate-bounce' : 'opacity-40'
                  }`}>
                    {milestone.icon}
                  </div>
                  <p className={`text-sm font-medium ${
                    !milestone.achieved && 'text-base-content/50'
                  }`}>
                    {milestone.label}
                  </p>
                  <p className={`text-xs ${
                    milestone.achieved ? 'opacity-90' : 'text-base-content/40'
                  }`}>
                    {milestone.days} days
                  </p>
                  {milestone.achieved && (
                    <div className="badge badge-sm bg-white/30 border-none mt-2">
                      ✓ Achieved
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Motivation Quote */}
      {streakData.currentStreak > 0 && (
        <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
          <div className="card-body text-center">
            <div className="text-4xl mb-3">💫</div>
            <p className="text-lg font-medium">
              {getCelebrationMessage(streakData.currentStreak)}
            </p>
          </div>
        </div>
      )}

      {/* Coming Soon Features */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lg mb-3">Coming Soon</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="badge badge-primary badge-lg">📅</div>
              <div>
                <p className="font-medium">Visual Calendar</p>
                <p className="text-sm text-base-content/60">
                  See your daily check-ins on a monthly calendar view
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="badge badge-secondary badge-lg">⏰</div>
              <div>
                <p className="font-medium">Daily Reminders</p>
                <p className="text-sm text-base-content/60">
                  Get notified to maintain your streak
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="badge badge-accent badge-lg">🎯</div>
              <div>
                <p className="font-medium">Custom Goals</p>
                <p className="text-sm text-base-content/60">
                  Set specific workout or habit goals to track
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="badge badge-info badge-lg">😴</div>
              <div>
                <p className="font-medium">Rest Day Support</p>
                <p className="text-sm text-base-content/60">
                  Mark rest days without breaking your streak
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Flame className="w-8 h-8" />
          </div>
          <div className="stat-title">Current Streak</div>
          <div className="stat-value text-primary">{streakData.currentStreak}</div>
          <div className="stat-desc">Keep it going!</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="stat-title">Best Streak</div>
          <div className="stat-value text-secondary">{streakData.longestStreak}</div>
          <div className="stat-desc">Personal record</div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
