import React from 'react';
import { TrendingDown, Brain, BarChart3, Calendar } from 'lucide-react';

const Navigation = ({ activeModule, onModuleChange }) => {
  const modules = [
    { 
      id: 'weight', 
      label: 'Weight', 
      icon: TrendingDown,
    },
    { 
      id: 'psychology', 
      label: 'Mind', 
      icon: Brain,
    },
    { 
      id: 'analytics', 
      label: 'Stats', 
      icon: BarChart3,
    },
    { 
      id: 'calendar', 
      label: 'Streak', 
      icon: Calendar,
    },
  ];

  return (
    <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-200 p-2 grid grid-cols-4 gap-1">
      {modules.map((module) => {
        const Icon = module.icon;
        const isActive = activeModule === module.id;
        
        return (
          <button
            key={module.id}
            onClick={() => onModuleChange(module.id)}
            className={`
              flex flex-col items-center justify-center gap-1 p-3 rounded-xl
              transition-all duration-200 active:scale-95
              ${isActive 
                ? 'bg-primary text-primary-content shadow-lg' 
                : 'text-base-content/60 hover:bg-base-200'
              }
            `}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{module.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;
