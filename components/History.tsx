
import React, { useState, useMemo } from 'react';
import { ActivityType } from '../types';

interface HistoryProps {
  logs: Record<string, ActivityType>;
}

type DensityViewMode = 'month' | 'year';

const History: React.FC<HistoryProps> = ({ logs }) => {
  const [currentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<DensityViewMode>('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const stats = useMemo(() => {
    const logEntries = Object.entries(logs);
    const monthPrefix = `${currentYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

    const monthlyEntries = logEntries.filter(([date]) => date.startsWith(monthPrefix));
    const monthlyCreators = monthlyEntries.filter(([_, v]) => v === 'creator').length;
    const monthlyBalanced = monthlyEntries.filter(([_, v]) => v === 'balanced').length;
    const monthlyConsumers = monthlyEntries.filter(([_, v]) => v === 'consumer').length;
    const monthlyTotal = monthlyCreators + monthlyBalanced + monthlyConsumers;

    const yearlyEntries = logEntries.filter(([date]) => date.startsWith(`${currentYear}-`));
    const yearlyCreators = yearlyEntries.filter(([_, v]) => v === 'creator').length;
    const yearlyBalanced = yearlyEntries.filter(([_, v]) => v === 'balanced').length;
    const yearlyConsumers = yearlyEntries.filter(([_, v]) => v === 'consumer').length;
    const yearlyTotal = yearlyCreators + yearlyBalanced + yearlyConsumers;

    return {
      monthly: { creators: monthlyCreators, balanced: monthlyBalanced, consumers: monthlyConsumers, total: monthlyTotal },
      yearly: { creators: yearlyCreators, balanced: yearlyBalanced, consumers: yearlyConsumers, total: yearlyTotal }
    };
  }, [logs, currentYear, selectedMonth]);

  const DistributionChart = ({ creators, consumers, balanced, total, label }: { creators: number, consumers: number, balanced: number, total: number, label: string }) => {
    const size = 110;
    const strokeWidth = 10;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const creatorLen = total > 0 ? (creators / total) * circumference : 0;
    const consumerLen = total > 0 ? (consumers / total) * circumference : 0;
    const balancedLen = total > 0 ? (balanced / total) * circumference : 0;

    return (
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center mb-4" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            {/* Base Background */}
            <circle cx={center} cy={center} r={radius} fill="transparent" stroke="white" strokeWidth={strokeWidth} className="opacity-5" />
            
            {/* Creator Segment (Green) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth={strokeWidth}
              strokeDasharray={`${creatorLen} ${circumference}`}
              strokeDashoffset={0}
              className="transition-all duration-1000 ease-out"
              strokeLinecap={creatorLen > 0 ? "round" : "butt"}
            />
            
            {/* Consumer Segment (Red) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#ef4444"
              strokeWidth={strokeWidth}
              strokeDasharray={`${consumerLen} ${circumference}`}
              strokeDashoffset={-creatorLen}
              className="transition-all duration-1000 ease-out"
              strokeLinecap={consumerLen > 0 ? "round" : "butt"}
            />

            {/* Balanced Segment (Yellow) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#facc15"
              strokeWidth={strokeWidth}
              strokeDasharray={`${balancedLen} ${circumference}`}
              strokeDashoffset={-(creatorLen + consumerLen)}
              className="transition-all duration-1000 ease-out"
              strokeLinecap={balancedLen > 0 ? "round" : "butt"}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-black font-mono tracking-tighter leading-none">
              {total}
            </span>
            <span className="text-[6px] font-bold opacity-30 uppercase font-pixel tracking-tighter mt-1">LOGS</span>
          </div>
        </div>
        <span className="text-[7px] font-bold font-pixel uppercase tracking-[0.2em] opacity-40">{label}</span>
      </div>
    );
  };

  const getDayData = (m: number, d: number) => {
    const dateObj = new Date(currentYear, m, d);
    const dateStr = `${currentYear}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const type = logs[dateStr];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = dateObj < today;

    let bgColor = 'bg-white/[0.05]';
    let shadow = '';

    if (type === 'creator') {
      bgColor = 'bg-emerald-500';
      shadow = 'shadow-[0_0_8px_rgba(16,185,129,0.3)]';
    } else if (type === 'consumer') {
      bgColor = 'bg-red-500';
      shadow = 'shadow-[0_0_8px_rgba(239,68,68,0.3)]';
    } else if (type === 'balanced') {
      bgColor = 'bg-yellow-400';
      shadow = 'shadow-[0_0_8px_rgba(250,204,21,0.3)]';
    } else if (isPast) {
      bgColor = 'bg-zinc-600';
    }

    return { bgColor, shadow, dateStr, isValid: dateObj.getMonth() === m };
  };

  const MonthlyDensity = () => {
    const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, selectedMonth, 1).getDay();
    
    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedMonth(prev => (prev > 0 ? prev - 1 : 11))}
              className="opacity-30 hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span className="text-[10px] font-bold font-mono tracking-widest uppercase">{monthNames[selectedMonth]}</span>
            <button 
              onClick={() => setSelectedMonth(prev => (prev < 11 ? prev + 1 : 0))}
              className="opacity-30 hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6 6 6"/></svg>
            </button>
          </div>
          <span className="text-[8px] font-bold font-pixel opacity-20 uppercase tracking-tighter">Day Map</span>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 42 }).map((_, i) => {
            const dayNum = i - firstDay + 1;
            if (dayNum <= 0 || dayNum > daysInMonth) return <div key={i} className="aspect-square" />;
            
            const { bgColor, shadow, dateStr } = getDayData(selectedMonth, dayNum);
            const delay = (i * 15);

            return (
              <div 
                key={dateStr}
                className={`aspect-square rounded-[4px] transition-all duration-700 opacity-0 animate-grid-cell-in ${bgColor} ${shadow}`}
                style={{ animationDelay: `${delay}ms` }}
                title={dateStr}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const YearlyDensity = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const monthNamesShort = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

    return (
      <div className="flex justify-between gap-1 overflow-x-auto pb-4 no-scrollbar animate-in fade-in duration-500">
        {months.map(m => (
          <div key={m} className="flex flex-col gap-[3px] items-center">
            <span className="text-[7px] font-bold font-pixel opacity-30 mb-2">{monthNamesShort[m]}</span>
            <div className="flex flex-col gap-[3px]">
              {Array.from({ length: 31 }, (_, d) => {
                const day = d + 1;
                const { bgColor, shadow, dateStr, isValid } = getDayData(m, day);
                if (!isValid) return <div key={`${m}-${day}`} className="w-2.5 h-2.5 opacity-0" />;
                
                const delay = (m * 40) + (d * 8);

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
    );
  };

  return (
    <div className="p-8 pb-32 max-w-lg mx-auto animate-in fade-in duration-700 space-y-12">
      <header className="mb-2">
        <h2 className="text-2xl font-extrabold tracking-[0.1em] uppercase font-sans leading-none">History</h2>
        <div className="flex justify-between items-center mt-4">
          <p className="opacity-40 text-[9px] font-bold tracking-[0.4em] uppercase font-mono">Performance Archive</p>
          
          <div className="flex bg-white/[0.05] p-1 rounded-lg border border-white/[0.03]">
            <button 
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-[8px] font-pixel uppercase tracking-tighter transition-all rounded ${viewMode === 'month' ? 'bg-white/10 opacity-100 shadow-sm' : 'opacity-20 hover:opacity-40'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setViewMode('year')}
              className={`px-3 py-1 text-[8px] font-pixel uppercase tracking-tighter transition-all rounded ${viewMode === 'year' ? 'bg-white/10 opacity-100 shadow-sm' : 'opacity-20 hover:opacity-40'}`}
            >
              Year
            </button>
          </div>
        </div>
      </header>

      {/* Legend in Creator, Consumer, Balanced order */}
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 py-2 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-[1px] bg-emerald-500" />
          <span className="text-[7px] font-bold font-pixel uppercase opacity-40 tracking-widest">Creator</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-[1px] bg-red-500" />
          <span className="text-[7px] font-bold font-pixel uppercase opacity-40 tracking-widest">Consumer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-[1px] bg-yellow-400" />
          <span className="text-[7px] font-bold font-pixel uppercase opacity-40 tracking-widest">Balanced</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-[1px] bg-zinc-600" />
          <span className="text-[7px] font-bold font-pixel uppercase opacity-40 tracking-widest">Missed</span>
        </div>
      </div>

      <section className="p-8 rounded-[40px] bg-white/[0.02]">
        {viewMode === 'month' ? <MonthlyDensity /> : <YearlyDensity />}
      </section>

      <section className="p-8 rounded-[40px] bg-white/[0.02] relative">
        <div className="absolute top-4 left-6 text-[8px] font-bold uppercase tracking-[0.4em] opacity-30 font-pixel">Live Snapshots</div>
        <div className="flex justify-around items-center pt-8 pb-4">
          <DistributionChart 
            creators={stats.monthly.creators} 
            consumers={stats.monthly.consumers}
            balanced={stats.monthly.balanced}
            total={stats.monthly.total}
            label="SELECTED MONTH" 
          />
          <DistributionChart 
            creators={stats.yearly.creators} 
            consumers={stats.yearly.consumers}
            balanced={stats.yearly.balanced}
            total={stats.yearly.total}
            label="ENTIRE YEAR" 
          />
        </div>
        {/* Stats in Creator, Consumer, Balanced order */}
        <div className="grid grid-cols-3 gap-2 pt-8 border-t border-white/[0.05]">
          <div className="text-center">
            <p className="text-[6px] opacity-40 font-pixel uppercase mb-1 text-zinc-500">Creators</p>
            <p className="text-base font-bold font-mono text-emerald-500">{stats.yearly.creators}</p>
          </div>
          <div className="text-center">
            <p className="text-[6px] opacity-40 font-pixel uppercase mb-1 text-zinc-500">Consumers</p>
            <p className="text-base font-bold font-mono text-red-500">{stats.yearly.consumers}</p>
          </div>
          <div className="text-center">
            <p className="text-[6px] opacity-40 font-pixel uppercase mb-1 text-zinc-500">Balanced</p>
            <p className="text-base font-bold font-mono text-yellow-400">{stats.yearly.balanced}</p>
          </div>
        </div>
      </section>

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

export default History;
