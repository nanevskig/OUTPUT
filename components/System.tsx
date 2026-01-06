
import React, { useMemo } from 'react';
import { AppState } from '../types';

interface SystemProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

const QUOTES = [
  { text: "The best way to predict the future is to create it.", author: "PETER DRUCKER" },
  { text: "Output is the only metric that matters.", author: "STRATEGIST" },
  { text: "Your input determines your output.", author: "SYSTEM ARCHITECT" },
  { text: "Creativity is intelligence having fun.", author: "ALBERT EINSTEIN" },
  { text: "The secret of getting ahead is getting started.", author: "MARK TWAIN" },
  { text: "Don't wait. The time will never be just right.", author: "NAPOLEON HILL" },
  { text: "Action is the foundational key to all success.", author: "PABLO PICASSO" },
  { text: "The only way to do great work is to love what you do.", author: "STEVE JOBS" },
  { text: "Focus on being productive instead of busy.", author: "TIM FERRISS" },
  { text: "Make each day your masterpiece.", author: "JOHN WOODEN" },
  { text: "Don't count the days, make the days count.", author: "MUHAMMAD ALI" },
  { text: "Everything you can imagine is real.", author: "PABLO PICASSO" },
  { text: "What you do today can improve all your tomorrows.", author: "RALPH MARSTON" },
  { text: "Build your own dreams, or someone else will hire you.", author: "FARRAH GRAY" },
  { text: "You can't use up creativity. The more you use, the more you have.", author: "MAYA ANGELOU" },
  { text: "Amateurs wait for inspiration. Professionals go to work.", author: "STEPHEN KING" },
  { text: "It’s not what you look at that matters, it’s what you see.", author: "HENRY THOREAU" },
  { text: "The path to success is to take massive, determined action.", author: "TONY ROBBINS" },
  { text: "The work itself is the only thing that matters.", author: "ANONYMOUS" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "JIM ROHN" }
];

const System: React.FC<SystemProps> = ({ state, updateState }) => {
  // Deterministic quote based on the current date (YYYY-MM-DD)
  // This ensures the quote only changes once every 24 hours.
  const currentQuote = useMemo(() => {
    const now = new Date();
    const daySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const index = daySeed % QUOTES.length;
    return QUOTES[index];
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] p-8 pb-24 max-w-lg mx-auto animate-in fade-in duration-700 flex flex-col">
      <header className="mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight uppercase mb-1 font-sans">System</h2>
        <p className="opacity-40 text-[9px] font-bold tracking-[0.4em] uppercase font-mono">Parameters</p>
      </header>

      <div className="space-y-4 flex-grow">
        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.03]">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 font-mono text-white">Reminders</h3>
            <p className="text-[9px] opacity-40 uppercase tracking-tighter font-mono text-white">
              Daily at {state.reminderTime}
            </p>
          </div>
          <button 
            onClick={() => updateState({ remindersEnabled: !state.remindersEnabled })}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${state.remindersEnabled ? 'bg-emerald-500' : 'bg-zinc-800'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${state.remindersEnabled ? 'right-1 bg-white' : 'left-1 bg-zinc-500'}`} />
          </button>
        </div>

        {/* Time Selection */}
        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.03]">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 opacity-40 font-mono text-white">Reminder Time</h3>
          <input 
            type="time" 
            value={state.reminderTime}
            onChange={(e) => updateState({ reminderTime: e.target.value })}
            className="w-full bg-transparent border-b border-white/[0.1] rounded-none pb-2 text-3xl font-bold font-mono focus:border-white focus:outline-none transition-colors text-white"
          />
        </div>
      </div>

      {/* Motivational Quote Section */}
      <div className="mt-12">
        <div className="p-10 rounded-[45px] bg-white/[0.02] border border-white/[0.05] relative text-center">
          <p className="text-sm font-bold leading-relaxed opacity-60 font-sans italic mb-6">
            "{currentQuote.text}"
          </p>
          <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-emerald-500 font-pixel">
            // {currentQuote.author}
          </p>
        </div>
      </div>
    </div>
  );
};

export default System;
