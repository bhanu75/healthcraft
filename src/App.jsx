import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import useAppStore from './store/useAppStore';
import Navigation from './components/Navigation';
import WeightTracker from './modules/WeightTracker/WeightTracker';
import Psychology from './modules/Psychology/Psychology';
import Analytics from './modules/Analytics/Analytics';
import Calendar from './modules/Calendar/Calendar';

function App() {
  const { activeModule, setActiveModule, theme, toggleTheme } = useAppStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const renderModule = () => {
    switch (activeModule) {
      case 'weight':
        return <WeightTracker />;
      case 'psychology':
        return <Psychology />;
      case 'analytics':
        return <Analytics />;
      case 'calendar':
        return <Calendar />;
      default:
        return <WeightTracker />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-24 transition-colors duration-300">
      {/* Main Container */}
      <div className="container mx-auto max-w-2xl px-4 py-6">
        {/* App Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-base-content mb-2">
              💪 Fitness Tracker
            </h1>
            <p className="text-base-content/70">
              Track your journey, stay motivated
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="btn btn-circle btn-ghost"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
        </header>

        {/* Module Content */}
        <main className="min-h-[70vh]">
          {renderModule()}
        </main>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
        <div className="container mx-auto max-w-2xl">
          <Navigation 
            activeModule={activeModule} 
            onModuleChange={setActiveModule} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
