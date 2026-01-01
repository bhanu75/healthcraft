import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingDown, Target, Activity, Calendar as CalendarIcon } from 'lucide-react';
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, parseISO } from 'date-fns';

const Analytics = () => {
  const { 
    weightData, 
    getWeeklyChange, 
    getMonthlyChange, 
    getAverageWeightLoss
  } = useAppStore();

  const [viewMode, setViewMode] = useState('weekly');

  const weeklyChange = getWeeklyChange();
  const monthlyChange = getMonthlyChange();
  const avgWeeklyLoss = getAverageWeightLoss();

  const weeklyBreakdown = useMemo(() => {
    if (weightData.length < 2) {
      return [];
    }
    
    const weeks = [];
    let currentWeek = [];
    
    for (let idx = 0; idx < weightData.length; idx++) {
      const entry = weightData[idx];
      currentWeek.push(entry);
      
      if (currentWeek.length === 7 || idx === weightData.length - 1) {
        const weekStart = currentWeek[0];
        const weekEnd = currentWeek[currentWeek.length - 1];
        const change = (weekEnd.weight - weekStart.weight).toFixed(1);
        const monthLabel = format(parseISO(weekEnd.date), 'MMM');
        
        weeks.push({
          week: 'Week ' + (weeks.length + 1),
          month: monthLabel,
          change: parseFloat(change),
          color: change < 0 ? '#10b981' : change > 0 ? '#ef4444' : '#6b7280'
        });
        
        currentWeek = [];
      }
    }
    
    return weeks;
  }, [weightData]);

  const monthlyReport = useMemo(() => {
    if (weightData.length === 0) {
      return [];
    }
    
    const firstDate = parseISO(weightData[0].date);
    const lastDate = parseISO(weightData[weightData.length - 1].date);
    const months = eachMonthOfInterval({ start: firstDate, end: lastDate });
    
    const report = months.map((monthDate) => {
      const monthStr = format(monthDate, 'MMM yyyy');
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const entriesInMonth = weightData.filter((entry) => {
        const entryDate = parseISO(entry.date);
        return entryDate >= monthStart && entryDate <= monthEnd;
      });
      
      if (entriesInMonth.length === 0) {
        return null;
      }
      
      const startWeight = entriesInMonth[0].weight;
      const endWeight = entriesInMonth[entriesInMonth.length - 1].weight;
      const change = (endWeight - startWeight).toFixed(1);
      const sumWeight = entriesInMonth.reduce((sum, e) => sum + e.weight, 0);
      const avgWeight = (sumWeight / entriesInMonth.length).toFixed(1);
      
      return {
        month: monthStr,
        startWeight: startWeight,
        endWeight: endWeight,
        avgWeight: parseFloat(avgWeight),
        change: parseFloat(change),
        entries: entriesInMonth.length,
        color: change < 0 ? '#10b981' : change > 0 ? '#ef4444' : '#6b7280'
      };
    });
    
    return report.filter(Boolean);
  }, [weightData]);

  const totalEntries = weightData.length;
  const totalDays = weightData.length > 1 
    ? Math.floor((parseISO(weightData[weightData.length - 1].date) - parseISO(weightData[0].date)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-green-500" />
            Analytics
          </h1>
          <p className="text-sm text-base-content/60">Track your progress insights</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          title="Weekly Change"
          value={weeklyChange > 0 ? '+' + weeklyChange : weeklyChange}
          unit="kg"
          subtitle="Last 7 days"
          gradient={weeklyChange < 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'}
          icon={TrendingDown}
        />
        <StatsCard
          title="Monthly Change"
          value={monthlyChange > 0 ? '+' + monthlyChange : monthlyChange}
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

      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('weekly')}
          className={'btn btn-sm flex-1 ' + (viewMode === 'weekly' ? 'btn-primary' : 'btn-outline')}
        >
          Weekly View
        </button>
        <button
          onClick={() => setViewMode('monthly')}
          className={'btn btn-sm flex-1 ' + (viewMode === 'monthly' ? 'btn-primary' : 'btn-outline')}
        >
          Monthly Report
        </button>
      </div>

      {viewMode === 'weekly' && weeklyBreakdown.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Weekly Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="week" 
                  stroke="#9ca3af"
                  style={{ fontSize: '11px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--b1))',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name, props) => [
                    value + ' kg', 
                    'Change (' + props.payload.month + ')'
                  ]}
                />
                <Bar dataKey="change" radius={[8, 8, 0, 0]}>
                  {weeklyBreakdown.map((entry, index) => (
                    <Cell key={'cell-' + index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-center text-base-content/60 mt-2">
              Showing weekly weight change across different months
            </div>
          </div>
        </div>
      )}

      {viewMode === 'monthly' && monthlyReport.length > 0 && (
        <div className="space-y-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Monthly Progress</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyReport}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    style={{ fontSize: '11px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--b1))',
                      border: '2px solid #3b82f6',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgWeight" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 6 }}
                    name="Avg Weight"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg mb-3">Monthly Breakdown</h2>
              <div className="space-y-3">
                {monthlyReport.map((month, idx) => (
                  <div key={idx} className="card bg-base-200 shadow">
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-5 h-5 text-primary" />
                          <h3 className="font-bold">{month.month}</h3>
                        </div>
                        <div className={'badge badge-lg ' + (
                          month.change < 0 ? 'badge-success' : 
                          month.change > 0 ? 'badge-error' : 
                          'badge-ghost'
                        )}>
                          {month.change > 0 ? '+' : ''}{month.change} kg
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-base-content/60">Start</p>
                          <p className="font-medium">{month.startWeight} kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">End</p>
                          <p className="font-medium">{month.endWeight} kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">Avg</p>
                          <p className="font-medium">{month.avgWeight} kg</p>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-base-content/60">
                        {month.entries} entries this month
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
                <div className="text-xs">You lost {Math.abs(weeklyChange)} kg this week. Keep it up!</div>
              </div>
            </div>
          ) : weeklyChange > 0 ? (
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold">Stay Focused</h3>
                <div className="text-xs">Weight increased by {weeklyChange} kg. Review your habits and stay consistent.</div>
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

          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Total Entries</div>
              <div className="stat-value text-primary">{totalEntries}</div>
              <div className="stat-desc">Data points recorded</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Tracking Duration</div>
              <div className="stat-value text-secondary">{totalDays}</div>
              <div className="stat-desc">Days since start</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Tracking Since</div>
              <div className="stat-value text-sm">
                {weightData.length > 0 
                  ? format(parseISO(weightData[0].date), 'dd MMM yyyy')
                  : 'N/A'
                }
              </div>
              <div className="stat-desc">First entry date</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
