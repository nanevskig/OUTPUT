
import React, { useState, useEffect } from 'react';
import { ActivityType } from '../types';

interface DailyInputProps {
  onLog: (type: ActivityType) => void;
  existingLog?: ActivityType;
}

type PopupStatus = 'idle' | 'visible' | 'fading';

const DailyInput: React.FC<DailyInputProps> = ({ onLog, existingLog }) => {
  const [popupStatus, setPopupStatus] = useState<PopupStatus>('idle');
  const [lastSelected, setLastSelected] = useState<ActivityType | null>(null);
  const [isActive, setIsActive] = useState(false);
  
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  const handleSelection = (type: ActivityType) => {
    if (existingLog) return;
    setLastSelected(type);
    onLog(type);
    setPopupStatus('visible');
    // Trigger the entry transition in the next tick
    setTimeout(() => setIsActive(true), 10);
  };

  useEffect(() => {
    if (popupStatus === 'visible') {
      const timer = setTimeout(() => {
        setPopupStatus('fading');
        setIsActive(false);
      }, 1800);
      return () => clearTimeout(timer);
    } else if (popupStatus === 'fading') {
      const timer = setTimeout(() => {
        setPopupStatus('idle');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [popupStatus]);

  return (
    <div className="relative flex flex-col min-h-screen px-8 animate-in fade-in duration-700">
      
      {/* Top Centered Date */}
      <div className="w-full text-center pt-12 shrink-0">
        <p className="opacity-40 uppercase tracking-[0.4em] text-[10px] font-bold font-mono">
          / {dateString}
        </p>
      </div>

      {/* Main Content: Question + Buttons (Centering logic) */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-10">
        <div className="text-center mb-16">
          <h1 className="text-xl font-extrabold tracking-[0.3em] leading-relaxed uppercase font-sans">
            WHO WERE <br/> YOU TODAY?
          </h1>
        </div>

        <div className="flex flex-col w-full max-w-[260px] gap-6">
          <button
            disabled={!!existingLog}
            onClick={() => handleSelection('creator')}
            className={`group relative h-20 rounded-full flex flex-col items-center justify-center transition-all overflow-hidden ${
              existingLog === 'creator' 
                ? 'bg-emerald-500 text-black shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]' 
                : existingLog
                  ? 'opacity-20 border border-white/[0.05] text-white cursor-not-allowed'
                  : 'bg-white/[0.02] border border-white/[0.05] text-white active:scale-95 hover:border-emerald-500/50'
            }`}
          >
            <span className="text-sm font-extrabold tracking-[0.2em] uppercase z-10 font-sans text-inherit">Creator</span>
            {!existingLog && (
              <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity" />
            )}
          </button>

          <button
            disabled={!!existingLog}
            onClick={() => handleSelection('consumer')}
            className={`group relative h-20 rounded-full flex flex-col items-center justify-center transition-all overflow-hidden ${
              existingLog === 'consumer'
                ? 'bg-red-500 text-black shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]' 
                : existingLog
                  ? 'opacity-20 border border-white/[0.05] text-white cursor-not-allowed'
                  : 'bg-white/[0.02] border border-white/[0.05] text-white active:scale-95 hover:border-red-500/50'
            }`}
          >
            <span className="text-sm font-extrabold tracking-[0.2em] uppercase z-10 font-sans text-inherit">Consumer</span>
            {!existingLog && (
              <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-5 transition-opacity" />
            )}
          </button>
        </div>
      </div>

      {/* Footer Text: Significantly higher from the Bottom Navigation Area */}
      <div className="mt-auto pb-32 text-center shrink-0">
        <div className="w-8 h-[1px] bg-white/[0.1] mx-auto"></div>
        <p className="mt-6 opacity-30 text-[8px] tracking-[0.5em] font-medium uppercase font-pixel">
          {existingLog ? 'Locked for today' : 'Observation is key'}
        </p>
      </div>

      {/* Enhanced Popup Overlay */}
      {popupStatus !== 'idle' && (
        <div 
          className={`fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md pointer-events-none transition-all duration-700 ease-out ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className={`bg-black px-12 py-14 rounded-[3rem] border border-white/[0.05] shadow-[0_40px_100px_rgba(0,0,0,1)] flex flex-col items-center text-center transition-all duration-700 delay-75 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              isActive ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-90'
            }`}
          >
            <div className={`w-14 h-14 mb-8 flex items-center justify-center rounded-full border border-white/[0.1] transition-all duration-1000 delay-300 ${isActive ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            
            <div className="space-y-1">
              <span className="text-[8px] font-pixel opacity-40 uppercase tracking-[0.5em] block mb-2 text-white">Log Recorded</span>
              <h2 className={`text-3xl font-black uppercase italic tracking-tighter text-white transition-all duration-700 delay-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {lastSelected}
              </h2>
            </div>
            
            <div className={`mt-8 w-6 h-px bg-white/20 transition-all duration-1000 delay-500 ${isActive ? 'w-6 opacity-100' : 'w-0 opacity-0'}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyInput;
