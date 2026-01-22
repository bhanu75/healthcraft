import React from 'react';
import { BarChart3, TrendingDown, Target, Activity, Calendar as CalendarIcon, Award } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import StatsCard from '../../components/StatsCard';

const Analytics = () => {
  const { 
    weightData,
    getWeeklyChange,
    getMonthlyChange,
    getAverageWeightLoss,
    getCurrentWeight,
    getStartWeight,
    getTotalChange
  } = useAppStore();

  const weeklyChange = getWeeklyChange();
  const monthlyChange = getMonthlyChange();
  const avgWeeklyLoss = getAverageWeightLoss();
  const currentWeight = getCurrentWeight();
  const startWeight = getStartWeight();
  const totalChange = getTotalChange();

  const totalEntries = weightData.length;

  // Simple calculations
  const getTrackingDays = () => {
    if (weightData.length < 2) return 0;
    const first = new Date(weightData[0].date);
    const last = new Date(weightData[weightData.length - 1].date);
    return Math.floor((last - first) / (1000 * 60 * 60 * 24));
  };

  const getFirstEntryDate = () => {
    if (weightData.length === 0) return 'N/A';
    const date = new Date(weightData[0].date);
    return date.toLocaleDateString('en-GB');
  };

  const trackingDays = getTrackingDays();
  const firstEntry = getFirstEntryDate();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-green-500" />
            Analytics
          </h1>
          <p className="text-sm text-base-content/60">Track your progress insights</p>
        </div>
      </div>

      {/* Stats Cards */}
      {currentWeight > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              title="Weekly Change"
              value={weeklyChange > 0 ? `+${weeklyChange}` : weeklyChange}
              unit="kg"
              subtitle="Last 7 days"
              gradient={weeklyChange < 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'}
              icon={TrendingDown}
            />
            <StatsCard
              title="Monthly Change"
              value={monthlyChange > 0 ? `+${monthlyChange}` : monthlyChange}
              unit="kg"
              subtitle="Last 30 days"
              gradient={monthlyChange < 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'}
              icon={Target}
            />
          </div>

          <StatsCard
            title="Average Weekly"
            value={Math.abs(avgWeeklyLoss)}
            unit="kg/week"
            subtitle={avgWeeklyLoss < 0 ? 'Great progress!' : 'Keep pushing!'}
            gradient="from-purple-500 to-purple-600"
            icon={Activity}
          />
        </>
      )}

      {/* Insights Card */}
      {currentWeight > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg mb-3">
              <Award className="w-6 h-6 text-yellow-500" />
              Insights
            </h2>
            
            {weeklyChange < 0 ? (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">Excellent Progress! 🎉</h3>
                  <div className="text-xs">You lost {Math.abs(weeklyChange)} kg this week. Keep it up!</div>
                </div>
              </div>
            ) : weeklyChange > 0 ? (
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="font-bold">Stay Focused 💪</h3>
                  <div className="text-xs">Weight increased by {weeklyChange} kg. Review your habits and stay consistent.</div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 className="font-bold">Stable Weight ⚖️</h3>
                  <div className="text-xs">Maintaining current weight. Keep going!</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lg mb-3">
            <CalendarIcon className="w-6 h-6 text-blue-500" />
            Summary
          </h2>
          
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Total Entries</div>
              <div className="stat-value text-primary">{totalEntries}</div>
              <div className="stat-desc">Data points recorded</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Tracking Duration</div>
              <div className="stat-value text-secondary">{trackingDays}</div>
              <div className="stat-desc">Days since start</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">First Entry</div>
              <div className="stat-value text-sm text-accent">{firstEntry}</div>
              <div className="stat-desc">Started tracking</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      {currentWeight > 0 && startWeight > 0 && (
        <div className="card bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-lg mb-3">Your Journey 🚀</h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs opacity-80">Started</p>
                <p className="text-2xl font-bold">{startWeight}</p>
                <p className="text-xs opacity-80">kg</p>
              </div>
              
              <div>
                <p className="text-xs opacity-80">Current</p>
                <p className="text-2xl font-bold">{currentWeight}</p>
                <p className="text-xs opacity-80">kg</p>
              </div>
              
              <div>
                <p className="text-xs opacity-80">Change</p>
                <p className="text-2xl font-bold">
                  {totalChange > 0 ? '+' : ''}{totalChange}
                </p>
                <p className="text-xs opacity-80">kg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {weightData.length === 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">No Data Yet</h3>
            <p className="text-base-content/60 mb-4">
              Start tracking your weight to see detailed analytics
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary btn-wide"
            >
              Add Your First Entry
            </button>
          </div>
        </div>
      )}

      {/* Coming Soon */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lg mb-3">🔜 Coming Soon</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="badge badge-primary">📈</div>
              <div>
                <p className="font-medium">Weekly & Monthly Charts</p>
                <p className="text-xs text-base-content/60">Visual progress breakdown</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="badge badge-secondary">📅</div>
              <div>
                <p className="font-medium">Trend Analysis</p>
                <p className="text-xs text-base-content/60">Predict future progress</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="badge badge-accent">🎯</div>
              <div>
                <p className="font-medium">Goal Tracking</p>
                <p className="text-xs text-base-content/60">Time to reach your target</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
