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
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
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
    <div className="min-h-screen bg-base-200 pb-28 transition-colors duration-300">
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-base-content mb-1 flex items-center gap-2">
              💪 Fitness Tracker
            </h1>
            <p className="text-sm text-base-content/60">
              Track your journey, stay motivated
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="btn btn-circle btn-ghost"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </header>

        <main>
          {renderModule()}
        </main>
      </div>

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
