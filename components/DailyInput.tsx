
import React, { useState, useEffect, useMemo } from 'react';
import { ActivityType } from '../types';

interface DailyInputProps {
  onLog: (type: ActivityType) => void;
  existingLog?: ActivityType;
}

type PopupStatus = 'idle' | 'visible' | 'fading';

const DailyInput: React.FC<DailyInputProps> = ({ onLog, existingLog }) => {
  const [popupStatus, setPopupStatus] = useState<PopupStatus>('idle');
  const [lastSelected, setLastSelected] = useState<ActivityType | null>(null);
  
  const dateString = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }, [existingLog]);

  const handleSelection = (type: ActivityType) => {
    if (existingLog) return;
    setLastSelected(type);
    onLog(type);
    setPopupStatus('visible');
  };

  useEffect(() => {
    if (popupStatus === 'visible') {
      const timer = setTimeout(() => {
        setPopupStatus('fading');
      }, 1500);
      return () => clearTimeout(timer);
    } else if (popupStatus === 'fading') {
      const timer = setTimeout(() => {
        setPopupStatus('idle');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [popupStatus]);

  const getLogColor = (log: ActivityType) => {
    switch (log) {
      case 'creator': return 'text-emerald-500';
      case 'consumer': return 'text-red-500';
      case 'balanced': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen px-8 animate-in fade-in duration-700">
      <style>{`
        @keyframes question-retro-blink {
          0%, 49.9% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .animate-question-blink {
          animation: question-retro-blink 1s infinite;
        }
      `}</style>

      {/* Top Centered Date */}
      <div className="w-full text-center pt-12 shrink-0">
        <p className="opacity-40 uppercase tracking-[0.4em] text-[10px] font-bold font-mono">
          / {dateString}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-10">
        {!existingLog ? (
          <>
            <div className="text-center mb-16">
              <h1 className="text-xl font-extrabold tracking-[0.3em] leading-relaxed uppercase font-sans">
                WHO WERE <br/> YOU TODAY<span className="animate-question-blink inline-block">?</span>
              </h1>
            </div>

            <div className="flex flex-col w-full max-w-[260px] gap-4">
              <button
                onClick={() => handleSelection('creator')}
                className="group relative h-16 rounded-full flex flex-col items-center justify-center transition-all overflow-hidden bg-white/[0.02] border border-white/[0.05] text-white active:scale-95 hover:border-emerald-500/50"
              >
                <span className="text-xs font-extrabold tracking-[0.2em] uppercase z-10 font-sans text-inherit">Creator</span>
                <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity" />
              </button>

              <button
                onClick={() => handleSelection('consumer')}
                className="group relative h-16 rounded-full flex flex-col items-center justify-center transition-all overflow-hidden bg-white/[0.02] border border-white/[0.05] text-white active:scale-95 hover:border-red-500/50"
              >
                <span className="text-xs font-extrabold tracking-[0.2em] uppercase z-10 font-sans text-inherit">Consumer</span>
                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-5 transition-opacity" />
              </button>

              <button
                onClick={() => handleSelection('balanced')}
                className="group relative h-16 rounded-full flex flex-col items-center justify-center transition-all overflow-hidden bg-white/[0.02] border border-white/[0.05] text-white active:scale-95 hover:border-yellow-400/50"
              >
                <span className="text-xs font-extrabold tracking-[0.2em] uppercase z-10 font-sans text-inherit">Balanced</span>
                <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-5 transition-opacity" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center animate-in zoom-in-95 duration-700">
            <h1 className="text-xs font-bold tracking-[0.4em] opacity-40 uppercase font-mono mb-8">
              {existingLog === 'balanced' ? 'TODAY YOU WERE:' : 'TODAY YOU WERE A:'}
            </h1>
            <div className={`text-5xl font-black italic tracking-tighter uppercase font-sans ${getLogColor(existingLog)}`}>
              {existingLog}<span className="animate-question-blink inline-block">.</span>
            </div>
            
            <p className="mt-16 text-[9px] font-bold tracking-[0.4em] opacity-30 uppercase font-mono animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500 fill-mode-forwards">
              See you tomorrow
            </p>
          </div>
        )}
      </div>

      {/* Footer Text */}
      <div className="mt-auto pb-32 text-center shrink-0">
        <div className="w-8 h-[1px] bg-white/[0.1] mx-auto"></div>
        <p className="mt-6 opacity-30 text-[8px] tracking-[0.5em] font-medium uppercase font-pixel">
          {existingLog ? 'Locked for today' : 'Observation is key'}
        </p>
      </div>

      {/* Pop-up Overlay */}
      {popupStatus !== 'idle' && (
        <div 
          className={`fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm pointer-events-none transition-opacity duration-500 ${
            popupStatus === 'fading' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div 
            className="bg-black px-12 py-12 rounded-[2.5rem] border border-white/[0.1] shadow-2xl flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-full border border-white/[0.1]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            
            <div className="space-y-1">
              <span className="text-[7px] font-pixel opacity-40 uppercase tracking-[0.4em] block mb-2 text-white">Entry Logged</span>
              <h2 className={`text-2xl font-black uppercase italic tracking-tighter ${lastSelected ? getLogColor(lastSelected) : 'text-white'}`}>
                {lastSelected}
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyInput;
