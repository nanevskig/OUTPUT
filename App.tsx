
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, View, ActivityType } from './types';
import { loadState, saveState, getTodayKey } from './utils/storage';
import BottomNav from './components/BottomNav';
import DailyInput from './components/DailyInput';
import History from './components/History';
import System from './components/System';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(loadState());
  const [currentView, setCurrentView] = useState<View>(View.DAILY);
  const [showSplash, setShowSplash] = useState(true);
  const [todayKey, setTodayKey] = useState(getTodayKey());

  // 1. Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 2. Persistence
  useEffect(() => {
    saveState(state);
  }, [state]);

  // 3. Midnight Reset Logic
  // Ensures that if the app is open during midnight, the view resets automatically
  useEffect(() => {
    const updateMidnight = () => {
      const now = new Date();
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // tomorrow
        0, 0, 0 // midnight
      );
      const msToMidnight = night.getTime() - now.getTime();

      return setTimeout(() => {
        setTodayKey(getTodayKey());
        updateMidnight(); // Recurse for the next day
      }, msToMidnight);
    };

    const timer = updateMidnight();
    
    // Also refresh on window focus to catch missed midnights
    const handleFocus = () => setTodayKey(getTodayKey());
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleLogActivity = useCallback((type: ActivityType) => {
    const currentToday = getTodayKey();
    setState(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [currentToday]: type
      }
    }));
    setTodayKey(currentToday);
  }, []);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case View.DAILY:
        return <DailyInput onLog={handleLogActivity} existingLog={state.logs[todayKey]} />;
      case View.HISTORY:
        return <History logs={state.logs} />;
      case View.SYSTEM:
        return <System state={state} updateState={updateState} />;
      default:
        return <DailyInput onLog={handleLogActivity} existingLog={state.logs[todayKey]} />;
    }
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[200]">
        <div className="flex flex-col items-center animate-intro-fade">
          <h1 className="text-white text-4xl font-black italic tracking-tighter uppercase font-sans mb-4">
            output
          </h1>
          <div className="w-16 h-[1px] bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-white animate-loading-grow origin-left" />
          </div>
        </div>
        <style>{`
          @keyframes loading-grow {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }
          @keyframes intro-fade {
            0% { opacity: 0; transform: translateY(10px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-5px); }
          }
          .animate-loading-grow {
            animation: loading-grow 1.5s ease-out forwards;
          }
          .animate-intro-fade {
            animation: intro-fade 1.5s ease-in-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-500/30 pb-16 animate-main-fade">
      <main className="mx-auto max-w-md">
        {renderContent()}
      </main>
      
      <BottomNav 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />
      
      <style>{`
        @keyframes main-fade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-main-fade {
          animation: main-fade 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
