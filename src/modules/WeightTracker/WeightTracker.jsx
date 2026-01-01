import React, { useState } from 'react';
import { Plus, TrendingDown, TrendingUp, Minus, Target, Info } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import WeightGraph from './WeightGraph';
import WeightForm from './WeightForm';
import GoalModal from './GoalModal';
import StatsCard from '../../components/StatsCard';

const WeightTracker = () => {
  const { 
    weightData, 
    addWeightEntry, 
    getCurrentWeight,
    getStartWeight,
    getTotalChange,
    getChangePercentage,
    goalWeight,
    getGoalProgress
  } = useAppStore();
  
  const [showForm, setShowForm] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleAddEntry = (date, weight) => {
    addWeightEntry(date, weight);
    setShowForm(false);
  };

  const current = getCurrentWeight();
  const start = getStartWeight();
  const change = getTotalChange();
  const changePercent = getChangePercentage();
  const goalProgress = getGoalProgress();

  // Sort entries by date descending (latest first)
  const sortedEntries = [...weightData].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Weight Tracker</h1>
          <p className="text-sm text-base-content/60">Monitor your progress</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="btn btn-circle btn-ghost"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-circle shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {current > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatsCard
            title="Current"
            value={current}
            unit="kg"
            gradient="from-blue-500 to-blue-600"
            icon={TrendingDown}
          />
          <StatsCard
            title="Start"
            value={start}
            unit="kg"
            gradient="from-purple-500 to-purple-600"
          />
          <StatsCard
            title="Change"
            value={change > 0 ? `+${change}` : change}
            unit="kg"
            subtitle={`${changePercent > 0 ? '+' : ''}${changePercent}%`}
            gradient={
              change < 0 
                ? 'from-green-500 to-green-600' 
                : change > 0 
                ? 'from-orange-500 to-orange-600'
                : 'from-gray-500 to-gray-600'
            }
            icon={change < 0 ? TrendingDown : change > 0 ? TrendingUp : Minus}
          />
        </div>
      )}

      {/* Goal Card */}
      {goalWeight && (
        <div className="card bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Goal Weight</p>
                <p className="text-2xl font-bold">{goalWeight} kg</p>
              </div>
              <Target className="w-8 h-8 opacity-80" />
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{goalProgress}%</span>
              </div>
              <progress 
                className="progress progress-warning bg-white/30" 
                value={goalProgress} 
                max="100"
              ></progress>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowGoalModal(true)}
        className="btn btn-outline btn-sm w-full"
      >
        {goalWeight ? 'Update Goal' : 'Set Goal'}
      </button>

      {/* Graph Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lg mb-2">Progress Chart</h2>
          <WeightGraph data={weightData} />
        </div>
      </div>

      {/* Recent Entries - Scrollable */}
      {sortedEntries.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg mb-2">Recent Entries</h2>
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="table table-sm table-pin-rows">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEntries.map((entry, idx) => {
                    const prevEntry = idx < sortedEntries.length - 1 ? sortedEntries[idx + 1] : null;
                    const change = prevEntry 
                      ? (entry.weight - prevEntry.weight).toFixed(1)
                      : null;
                    
                    return (
                      <tr key={entry.date} className="hover">
                        <td>{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                        <td className="font-medium">{entry.weight} kg</td>
                        <td>
                          {change && (
                            <span className={`badge badge-sm ${
                              change < 0 ? 'badge-success' : 
                              change > 0 ? 'badge-error' : 
                              'badge-ghost'
                            }`}>
                              {change > 0 ? '+' : ''}{change} kg
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Form Modal - Fixed Position */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md">
            <WeightForm
              onSubmit={handleAddEntry}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Goal Modal */}
      {showGoalModal && (
        <GoalModal onClose={() => setShowGoalModal(false)} />
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card bg-base-100 w-full max-w-md shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Understanding Your Stats</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-bold text-primary">Current Weight</p>
                  <p className="text-base-content/70">Your most recent weight entry</p>
                </div>

                <div>
                  <p className="font-bold text-secondary">Starting Weight</p>
                  <p className="text-base-content/70">
                    {start > 0 
                      ? 'Your first recorded weight' 
                      : 'Will be set when you add your first entry'
                    }
                  </p>
                </div>

                <div>
                  <p className="font-bold text-accent">Change</p>
                  <p className="text-base-content/70">
                    Total weight change from start to current
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">
                    Formula: Current Weight - Starting Weight
                  </p>
                </div>

                <div>
                  <p className="font-bold text-warning">Percentage Change</p>
                  <p className="text-base-content/70">
                    Your progress as a percentage of starting weight
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">
                    Formula: (Change / Starting Weight) × 100
                  </p>
                  {changePercent !== 0 && (
                    <p className="text-xs text-info mt-1">
                      Example: {changePercent}% = ({change} kg / {start} kg) × 100
                    </p>
                  )}
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button onClick={() => setShowInfoModal(false)} className="btn btn-primary">
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightTracker;
