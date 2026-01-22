import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  Line
} from 'recharts';
import { formatShortDate } from '../../utils/helpers';

const WeightGraph = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div className="bg-base-100 shadow-xl rounded-lg border-2 border-primary p-4 animate-scale-in">
          <p className="font-bold text-2xl text-primary mb-1">
            {entry.weight} kg
          </p>
          <p className="text-sm text-base-content/70">
            {formatShortDate(entry.date)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-base-content/50">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-lg font-medium">No data yet</p>
        <p className="text-sm">Add your first weight entry to see the graph</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tickMargin={10}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            domain={['dataMin - 2', 'dataMax + 2']}
            tickMargin={5}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 2 }} />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#colorWeight)"
            animationDuration={1000}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ 
              fill: '#3b82f6', 
              r: 5, 
              strokeWidth: 3, 
              stroke: '#fff' 
            }}
            activeDot={{ 
              r: 8, 
              fill: '#2563eb',
              strokeWidth: 3,
              stroke: '#fff'
            }}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightGraph;
