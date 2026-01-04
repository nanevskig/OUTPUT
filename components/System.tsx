
import React, { useState, useEffect } from 'react';
import { AppState } from '../types';

interface SystemProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

const QUOTES = [
  { text: "The best way to predict the future is to create it.", author: "PETER DRUCKER" },
  { text: "Don't build your life on what you consume.", author: "UNKNOWN" },
  { text: "You are what you repeatedly do.", author: "ARISTOTLE" },
  { text: "Creation is a better way of self-expression than possession.", author: "TAGORE" },
  { text: "Stop waiting for the right time. Start making it.", author: "SYSTEM" },
  { text: "Output is the only metric that matters.", author: "STRATEGIST" },
  { text: "Everything is a remix. Create the version you want to see.", author: "KIRBY FERGUSON" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "ABRAHAM LINCOLN" },
  { text: "The object of art is not to reproduce reality, but to create a reality of the same intensity.", author: "ALBERTO GIACOMETTI" },
  { text: "Don't just be a consumer. Be a contributor to the culture.", author: "MINIMALIST" },
  { text: "Your input determines your output. Your output determines your trajectory.", author: "SYSTEM ARCHITECT" }
];

const System: React.FC<SystemProps> = ({ state, updateState }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Select a random quote on component mount to "rotate" content
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuoteIndex(randomIndex);
  }, []);

  const currentQuote = QUOTES[quoteIndex];

  const toggleReminders = () => {
    updateState({ remindersEnabled: !state.remindersEnabled });
  };

  return (
    <div className="p-8 pb-32 max-w-lg mx-auto animate-in fade-in duration-700">
      <header className="mb-12">
        <h2 className="text-3xl font-extrabold tracking-[0.1em] uppercase mb-1 font-sans">System</h2>
        <p className="opacity-40 text-[9px] font-bold tracking-[0.4em] uppercase font-mono">Parameters</p>
      </header>

      <div className="space-y-4">
        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.1] transition-colors">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 font-mono text-white">Reminders</h3>
            <p className="text-[9px] opacity-40 uppercase tracking-tighter font-mono text-white">
              Daily at {state.reminderTime}
            </p>
          </div>
          <button 
            onClick={toggleReminders}
            className={`w-10 h-5 rounded-full transition-all duration-300 relative ${state.remindersEnabled ? 'bg-emerald-500' : 'bg-zinc-900 opacity-20'}`}
          >
            <div className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${state.remindersEnabled ? 'right-1 bg-white' : 'left-1 bg-zinc-400'}`} />
          </button>
        </div>

        {/* Time Selection */}
        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.1] transition-colors">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 opacity-40 font-mono text-white">Reminder Time</h3>
          <input 
            type="time" 
            value={state.reminderTime}
            onChange={(e) => updateState({ reminderTime: e.target.value })}
            className="w-full bg-transparent border-b border-white/[0.1] rounded-none pb-2 text-2xl font-bold font-mono focus:border-white focus:outline-none transition-colors text-white"
          />
        </div>

        {/* Minimalist Quote Section with Pairing */}
        <div className="pt-12 animate-in slide-in-from-bottom-4 duration-1000">
          <div className="p-10 rounded-[45px] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden text-center group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            
            <p className="text-base font-bold leading-relaxed tracking-wide opacity-80 font-sans italic mb-8 group-hover:opacity-100 transition-opacity">
              "{currentQuote.text}"
            </p>
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-4 h-px bg-emerald-500/30" />
              <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-emerald-500 font-pixel">
                // {currentQuote.author}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default System;
