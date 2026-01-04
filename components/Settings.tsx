
import React, { useMemo } from 'react';
import { AppState } from '../types';

interface SettingsProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

const QUOTES = [
  { text: "The best way to predict the future is to create it.", author: "PETER DRUCKER" },
  { text: "Don't build your life on what you consume.", author: "UNKNOWN" },
  { text: "You are what you repeatedly do.", author: "ARISTOTLE" },
  { text: "Creation is a better way of self-expression than possession.", author: "TAGORE" },
  { text: "Stop waiting for the right time. Start making it.", author: "SYSTEM" },
  { text: "Output is the only metric that matters.", author: "STRATEGIST" }
];

const Settings: React.FC<SettingsProps> = ({ state, updateState }) => {
  const dailyQuote = useMemo(() => {
    // Deterministic quote based on day of year
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

  const toggleReminders = () => {
    updateState({ remindersEnabled: !state.remindersEnabled });
  };

  return (
    <div className="p-8 pb-32 max-w-lg mx-auto animate-in fade-in duration-700">
      <header className="mb-12">
        <h2 className="text-3xl font-extrabold tracking-[0.1em] uppercase mb-1 font-sans">Settings</h2>
        <p className="opacity-40 text-[9px] font-bold tracking-[0.4em] uppercase font-mono">Preferences</p>
      </header>

      <div className="space-y-4">
        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.03]">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 font-mono text-white">Reminders</h3>
            <p className="text-[9px] opacity-40 uppercase tracking-tighter font-mono text-white">Daily at {state.reminderTime}</p>
          </div>
          <button 
            onClick={toggleReminders}
            className={`w-10 h-5 rounded-full transition-all duration-300 relative ${state.remindersEnabled ? 'bg-emerald-500' : 'bg-zinc-900 opacity-20'}`}
          >
            <div className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${state.remindersEnabled ? 'right-1 bg-white' : 'left-1 bg-zinc-400'}`} />
          </button>
        </div>

        {/* Time Selection */}
        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.03]">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 opacity-40 font-mono text-white">Reminder Time</h3>
          <input 
            type="time" 
            value={state.reminderTime}
            onChange={(e) => updateState({ reminderTime: e.target.value })}
            className="w-full bg-transparent border-b border-white/[0.1] rounded-none pb-2 text-2xl font-bold font-mono focus:border-white focus:outline-none transition-colors text-white"
          />
        </div>

        {/* Minimalist Quote Section */}
        <div className="pt-12">
          <div className="p-10 rounded-[45px] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden text-center">
            <p className="text-base font-bold leading-relaxed tracking-wide opacity-80 font-sans italic mb-8">
              "{dailyQuote.text}"
            </p>
            <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-emerald-500 font-pixel">
              // {dailyQuote.author}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;