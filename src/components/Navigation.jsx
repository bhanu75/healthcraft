import React from 'react';
import { TrendingDown, Brain, BarChart3, Calendar } from 'lucide-react';
import { cn } from '../utils/helpers';

const Navigation = ({ activeModule, onModuleChange }) => {
  const modules = [
    { 
      id: 'weight', 
      label: 'Weight', 
      icon: TrendingDown,
      color: 'text-blue-500'
    },
    { 
      id: 'psychology', 
      label: 'Mind', 
      icon: Brain,
      color: 'text-purple-500'
    },
    { 
      id: 'analytics', 
      label: 'Stats', 
      icon: BarChart3,
      color: 'text-green-500'
    },
    { 
      id: 'calendar', 
      label: 'Streak', 
      icon: Calendar,
      color: 'text-orange-500'
    },
  ];

  return (
    <nav className="btm-nav btm-nav-lg bg-base-100 shadow-2xl rounded-2xl border border-base-200">
      {modules.map((module) => {
        const Icon = module.icon;
        const isActive = activeModule === module.id;
        
        return (
          <button
            key={module.id}
            onClick={() => onModuleChange(module.id)}
            className={cn(
              "touch-manipulation transition-all duration-200",
              isActive && "active bg-primary text-primary-content"
            )}
          >
            <Icon className={cn(
              "w-6 h-6 mb-1",
              !isActive && module.color
            )} />
            <span className="text-xs font-medium btm-nav-label">
              {module.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
