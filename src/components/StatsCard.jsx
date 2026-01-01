import React from 'react';
import { cn } from '../utils/helpers';

const StatsCard = ({ 
  title, 
  value, 
  unit, 
  subtitle,
  gradient = 'from-blue-500 to-blue-600',
  icon: Icon,
  trend,
  trendValue
}) => {
  return (
    <div className={cn(
      "card bg-gradient-to-br text-white shadow-lg animate-scale-in",
      gradient
    )}>
      <div className="card-body p-4">
        {Icon && (
          <div className="flex items-center justify-between mb-2">
            <Icon className="w-5 h-5 opacity-80" />
            {trend && (
              <div className={cn(
                "badge badge-sm",
                trend === 'up' ? 'badge-success' : trend === 'down' ? 'badge-error' : 'badge-ghost'
              )}>
                {trendValue}
              </div>
            )}
          </div>
        )}
        <p className="text-xs opacity-80 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-bold">{value}</p>
          {unit && <p className="text-xs opacity-90">{unit}</p>}
        </div>
        {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
