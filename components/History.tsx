
import React, { useState, useMemo } from 'react';
import { ActivityType } from '../types';

interface HistoryProps {
  logs: Record<string, ActivityType>;
}

const History: React.FC<HistoryProps> = ({ logs }) => {
  const [currentYear] = useState(new Date().getFullYear());

  const stats = useMemo(() => {
    const logEntries = Object.entries(logs);
    const now = new Date();
    const currentMonthNum = now.getMonth() + 1;
    const monthPrefix = `${currentYear}-${String(currentMonthNum).padStart(2, '0')}`;

    const monthlyEntries = logEntries.filter(([date]) => date.startsWith(monthPrefix));
    const monthlyCreators = monthlyEntries.filter(([_, v]) => v === 'creator').length;
    const monthlyConsumers = monthlyEntries.filter(([_, v]) => v === 'consumer').length;
    const monthlyTotal = monthlyCreators + monthlyConsumers;
    const monthlyRatio = monthlyTotal > 0 ? (monthlyCreators / monthlyTotal) : 0;

    const yearlyEntries = logEntries.filter(([date]) => date.startsWith(`${currentYear}-`));
    const yearlyCreators = yearlyEntries.filter(([_, v]) => v === 'creator').length;
    const yearlyConsumers = yearlyEntries.filter(([_, v]) => v === 'consumer').length;
    const yearlyTotal = yearlyCreators + yearlyConsumers;
    const yearlyRatio = yearlyTotal > 0 ? (yearlyCreators / yearlyTotal) : 0;

    return {
      monthly: { creators: monthlyCreators, consumers: monthlyConsumers, total: monthlyTotal, ratio: monthlyRatio },
      yearly: { creators: yearlyCreators, consumers: yearlyConsumers, total: yearlyTotal, ratio: yearlyRatio }
    };
  }, [logs, currentYear]);

  const CompactPieChart = ({ ratio, label }: { ratio: number, label: string }) => {
    const size = 110;
    const strokeWidth = 8;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (ratio * circumference);

    return (
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center mb-4" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={center} cy={center} r={radius} fill="transparent" stroke="white" strokeWidth={strokeWidth} className="opacity-5" />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={ratio >= 0.5 ? "#10b981" : "#ef4444"}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-[1500ms] ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-black font-mono tracking-tighter leading-none">{Math.round(ratio * 100)}%</span>
          </div>
        </div>
        <span className="text-[7px] font-bold font-pixel uppercase tracking-[0.2em] opacity-40">{label}</span>
      </div>
    );
  };

  const DensityGrid = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const monthNamesShort = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 font-pixel">Activity Density</h3>
           <span className="text-[9px] font-bold font-mono opacity-40">{currentYear}</span>
        </div>
        
        <div className="flex justify-between gap-1 overflow-x-auto pb-4 no-scrollbar">
          {months.map(m => (
            <div key={m} className="flex flex-col gap-[3px] items-center">
              <span className="text-[7px] font-bold font-pixel opacity-30 mb-2">{monthNamesShort[m]}</span>
              <div className="flex flex-col gap-[3px]">
                {Array.from({ length: 31 }, (_, d) => {
                  const day = d + 1;
                  const dateObj = new Date(currentYear, m, day);
                  if (dateObj.getMonth() !== m) return <div key={`${m}-${day}`} className="w-2.5 h-2.5 opacity-0" />;
                  
                  const dateStr = `${currentYear}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const type = logs[dateStr];
                  const isPast = dateObj < today;
                  
                  let bgColor = 'bg-white/[0.05]';
                  let shadow = '';

                  if (type === 'creator') {
                    bgColor = 'bg-emerald-500';
                    shadow = 'shadow-[0_0_8px_rgba(16,185,129,0.3)]';
                  } else if (type === 'consumer') {
                    bgColor = 'bg-red-500';
                    shadow = 'shadow-[0_0_8px_rgba(239,68,68,0.3)]';
                  } else if (isPast) {
                    bgColor = 'bg-zinc-600';
                  }

                  // Staggered delay calculation based on month and day
                  const delay = (m * 50) + (d * 10);

                  return (
                    <div 
                      key={dateStr} 
                      className={`w-2.5 h-2.5 rounded-[1px] transition-all duration-700 opacity-0 animate-grid-cell-in ${bgColor} ${shadow}`} 
                      style={{ animationDelay: `${delay}ms` }}
                      title={dateStr} 
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes grid-cell-in {
            0% { opacity: 0; transform: scale(0.5); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-grid-cell-in {
            animation: grid-cell-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="p-8 pb-32 max-w-lg mx-auto animate-in fade-in duration-700 space-y-12">
      <header className="mb-2">
        <h2 className="text-2xl font-extrabold tracking-[0.1em] uppercase font-sans leading-none">History</h2>
        <p className="opacity-40 text-[9px] font-bold tracking-[0.4em] uppercase mt-4 font-mono">Performance Archive</p>
      </header>

      {/* Centered Legend */}
      <div className="flex justify-center gap-6 py-2 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-[1px] bg-emerald-500" />
          <span className="text-[7px] font-bold font-pixel uppercase opacity-40 tracking-widest">Creator</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-[1px] bg-red-500" />
          <span className="text-[7px] font-bold font-pixel uppercase opacity-40 tracking-widest">Consumer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-[1px] bg-zinc-600" />
          <span className="text-[7px] font-bold font-pixel uppercase opacity-40 tracking-widest">Missed</span>
        </div>
      </div>

      <section className="p-8 rounded-[40px] bg-white/[0.02]">
        <DensityGrid />
      </section>

      <section className="p-8 rounded-[40px] bg-white/[0.02] relative">
        <div className="absolute top-4 left-6 text-[8px] font-bold uppercase tracking-[0.4em] opacity-30 font-pixel">Live Snapshots</div>
        <div className="flex justify-around items-center pt-8 pb-4">
          <CompactPieChart ratio={stats.monthly.ratio} label="MONTH" />
          <CompactPieChart ratio={stats.yearly.ratio} label="YEAR" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/[0.05]">
          <div className="text-center">
            <p className="text-[7px] opacity-40 font-pixel uppercase mb-1 text-zinc-500">Creators</p>
            <p className="text-lg font-bold font-mono text-emerald-500">{stats.yearly.creators}</p>
          </div>
          <div className="text-center">
            <p className="text-[7px] opacity-40 font-pixel uppercase mb-1 text-zinc-500">Consumers</p>
            <p className="text-lg font-bold font-mono text-red-500">{stats.yearly.consumers}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;
