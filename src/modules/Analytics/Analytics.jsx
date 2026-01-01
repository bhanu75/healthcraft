import React from 'react';
import { BarChart3, TrendingDown, Target, Activity } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import StatsCard from '../../components/StatsCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';

const Analytics = () => {
  const { 
    weightData, 
    getWeeklyChange, 
    getMonthlyChange, 
    getAverageWeightLoss 
  } = useAppStore();

  const weeklyChange = getWeeklyChange();
  const monthlyChange = getMonthlyChange();
  const avgWeeklyLoss = getAverageWeightLoss();

  // Calculate weekly breakdown
  const getWeeklyBreakdown = () => {
    if (weightData.length < 2) return [];
    
    const weeks = [];
    let currentWeek = [];
    
    weightData.forEach((entry, idx) => {
      currentWeek.push(entry);
      
      if (currentWeek.length === 7 || idx === weightData.length - 1) {
        const weekStart = currentWeek[0].weight;
        const weekEnd = currentWeek[currentWeek.length - 1].weight;
        const change = (weekEnd - weekStart).toFixed(1);
        
        weeks.push({
          week: `Week ${weeks.length + 1}`,
          change: parseFloat(change),
          color: change < 0 ? '#10b981' : change > 0 ? '#ef4444' : '#6b7280'
        });
        
        currentWeek = [];
      }
    });
    
    return weeks;
  };

  const weeklyBreakdown = getWeeklyBreakdown();

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
      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          title="Weekly Change"
          value={weeklyChange > 0 ? `+${weeklyChange}` : weeklyChange}
          unit="kg"
          gradient={
            weeklyChange < 0 
              ? 'from-green-500 to-green-600' 
              : 'from-red-500 to-red-600'
          }
          icon={TrendingDown}
        />
        <StatsCard
          title="Monthly Change"
          value={monthlyChange > 0 ? `+${monthlyChange}` : monthlyChange}
          unit="kg"
          gradient={
            monthlyChange < 0 
              ? 'from-blue-500 to-blue-600' 
              : 'from-orange-500 to-orange-600'
          }
          icon={Target}
        />
      </div>

      <StatsCard
        title="Average Weekly Loss"
        value={Math.abs(avgWeeklyLoss)}
        unit="kg/week"
        subtitle={avgWeeklyLoss < 0 ? 'Great progress!' : 'Keep pushing!'}
        gradient="from-purple-500 to-purple-600"
        icon={Activity}
      />

      {/* Weekly Breakdown Chart */}
      {weeklyBreakdown.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Weekly Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="week" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value} kg`, 'Change']}
                />
                <Bar dataKey="change" radius={[8, 8, 0, 0]}>
                  {weeklyBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Insights Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lg mb-3">Insights</h2>
          
          {weeklyChange < 0 ? (
            <div className="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold">Excellent Progress!</h3>
                <div className="text-xs">You lost {Math.abs(weeklyChange)} kg this week</div>
              </div>
            </div>
          ) : weeklyChange > 0 ? (
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold">Stay Focused</h3>
                <div className="text-xs">Weight increased by {weeklyChange} kg. Review your habits</div>
              </div>
            </div>
          ) : (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="font-bold">Stable Weight</h3>
                <div className="text-xs">Maintaining current weight. Keep going!</div>
              </div>
            </div>
          )}

          <div className="divider"></div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-base-content/70">Total Entries</span>
              <span className="font-bold badge badge-lg">{weightData.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base-content/70">Tracking Since</span>
              <span className="font-bold">
                {weightData.length > 0 
                  ? new Date(weightData[0].date).toLocaleDateString()
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl">
        <div className="card-body">
          <h3 className="card-title mb-3">Coming Soon</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="badge badge-sm bg-white/20">📈</div>
              Trend prediction & goal projection
            </li>
            <li className="flex items-center gap-2">
              <div className="badge badge-sm bg-white/20">🎯</div>
              Custom goal setting with milestones
            </li>
            <li className="flex items-center gap-2">
              <div className="badge badge-sm bg-white/20">📊</div>
              Detailed monthly & yearly reports
            </li>
            <li className="flex items-center gap-2">
              <div className="badge badge-sm bg-white/20">💡</div>
              Personalized insights & recommendations
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
