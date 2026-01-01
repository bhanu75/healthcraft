import React, { useState } from 'react';
import { Plus, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import WeightGraph from './WeightGraph';
import WeightForm from './WeightForm';
import StatsCard from '../../components/StatsCard';
import { getWeightChangePercentage } from '../../utils/helpers';

const WeightTracker = () => {
  const { weightData, addWeightEntry } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  const handleAddEntry = (date, weight) => {
    addWeightEntry(date, weight);
    setShowForm(false);
  };

  const stats = weightData.length > 0 ? {
    current: weightData[weightData.length - 1].weight,
    start: weightData[0].weight,
    change: (weightData[weightData.length - 1].weight - weightData[0].weight).toFixed(1),
  } : null;

  const changePercent = stats 
    ? getWeightChangePercentage(stats.current, stats.start)
    : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Weight Tracker</h1>
          <p className="text-sm text-base-content/60">Monitor your progress</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary btn-circle shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <StatsCard
            title="Current"
            value={stats.current}
            unit="kg"
            gradient="from-blue-500 to-blue-600"
            icon={TrendingDown}
          />
          <StatsCard
            title="Start"
            value={stats.start}
            unit="kg"
            gradient="from-purple-500 to-purple-600"
          />
          <StatsCard
            title="Change"
            value={stats.change > 0 ? `+${stats.change}` : stats.change}
            unit="kg"
            subtitle={`${changePercent}%`}
            gradient={
              stats.change < 0 
                ? 'from-green-500 to-green-600' 
                : 'from-orange-500 to-orange-600'
            }
            icon={stats.change < 0 ? TrendingDown : stats.change > 0 ? TrendingUp : Minus}
          />
        </div>
      )}

      {/* Graph Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lg mb-2">Progress Chart</h2>
          <WeightGraph data={weightData} />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md">
            <WeightForm
              onSubmit={handleAddEntry}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Data Table */}
      {weightData.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg mb-2">Recent Entries</h2>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {[...weightData].reverse().slice(0, 5).map((entry, idx, arr) => {
                    const prevEntry = arr[idx + 1];
                    const change = prevEntry 
                      ? (entry.weight - prevEntry.weight).toFixed(1)
                      : null;
                    
                    return (
                      <tr key={entry.date}>
                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                        <td className="font-medium">{entry.weight} kg</td>
                        <td>
                          {change && (
                            <span className={`badge ${
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
    </div>
  );
};

export default WeightTracker;
