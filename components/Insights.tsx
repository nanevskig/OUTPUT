
import React, { useMemo } from 'react';
import { ActivityType } from '../types';

interface InsightsProps {
  logs: Record<string, ActivityType>;
}

const Insights: React.FC<InsightsProps> = ({ logs }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNum = now.getMonth() + 1;

  const stats = useMemo(() => {
    const logEntries = Object.entries(logs);
    
    // Monthly
    const monthlyEntries = logEntries.filter(([date]) => date.startsWith(`${currentYear}-${String(currentMonthNum).padStart(2, '0')}`));
    const monthlyCreators = monthlyEntries.filter(([_, v]) => v === 'creator').length;
    const monthlyConsumers = monthlyEntries.filter(([_, v]) => v === 'consumer').length;
    const monthlyRatio = monthlyEntries.length > 0 ? (monthlyCreators / (monthlyCreators + monthlyConsumers)) : 0.5;

    // Yearly
    const yearlyEntries = logEntries.filter(([date]) => date.startsWith(`${currentYear}-`));
    const yearlyCreators = yearlyEntries.filter(([_, v]) => v === 'creator').length;
    const yearlyConsumers = yearlyEntries.filter(([_, v]) => v === 'consumer').length;
    const totalYearlyLogged = yearlyCreators + yearlyConsumers;
    const yearlyRatio = totalYearlyLogged > 0 ? (yearlyCreators / totalYearlyLogged) : 0;

    return {
      monthly: { creators: monthlyCreators, consumers: monthlyConsumers, total: monthlyEntries.length, ratio: monthlyRatio },
      yearly: { creators: yearlyCreators, consumers: yearlyConsumers, total: totalYearlyLogged, ratio: yearlyRatio }
    };
  }, [logs, currentYear, currentMonthNum]);

  const PieChart = ({ ratio }: { ratio: number }) => {
    const size = 180;
    const strokeWidth = 12;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (ratio * circumference);

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background Ring (Consumer) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#ef4444" // red-500
            strokeWidth={strokeWidth}
            className="opacity-10"
          />
          {/* Main Ring (Consumer base) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            className="opacity-100"
          />
          {/* Progress Ring (Creator) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#10b981" // emerald-500
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out shadow-emerald-500/50"
            style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-black font-mono tracking-tighter leading-none">
            {Math.round(ratio * 100)}%
          </span>
          <span className="text-[7px] font-bold font-pixel uppercase tracking-[0.2em] text-zinc-500 mt-2">
            Output
          </span>
        </div>
      </div>
    );
  };

  const DensityGrid = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const today = new Date();
    today.setHours(0,0,0,0);

    return (
      <div className="flex justify-between gap-1 overflow-x-auto pb-2 no-scrollbar">
        {months.map(m => (
          <div key={m} className="flex flex-col gap-[3px] items-center">
            <span className="text-[6px] font-bold font-pixel text-zinc-700 mb-1">{monthNames[m]}</span>
            <div className="flex flex-col gap-[2px]">
              {Array.from({ length: 31 }, (_, d) => {
                const day = d + 1;
                const dateObj = new Date(currentYear, m, day);
                if (dateObj.getMonth() !== m) return <div key={d} className="w-2 h-2 opacity-0" />;
                
                const dateStr = `${currentYear}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const type = logs[dateStr];
                const isPast = dateObj < today;
                
                let color = 'bg-zinc-950';
                if (type === 'creator') color = 'bg-emerald-500';
                else if (type === 'consumer') color = 'bg-red-500';
                else if (isPast) color = 'bg-zinc-900';

                return (
                  <div 
                    key={dateStr}
                    className={`w-2 h-2 rounded-[0.5px] ${color}`}
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
      <header>
        <h2 className="text-3xl font-extrabold tracking-[0.1em] uppercase font-sans leading-none">Insights</h2>
        <p className="text-zinc-600 text-[9px] font-bold tracking-[0.4em] uppercase mt-4 font-mono">Statistical Recap</p>
      </header>

      {/* Yearly Pie Chart Section */}
      <section className="border border-zinc-900 p-8 rounded-[40px] bg-zinc-950/20 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-4 left-6 text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-700 font-pixel">Yearly Balance</div>
        
        <div className="mt-8 mb-8">
          <PieChart ratio={stats.yearly.ratio} />
        </div>

        <div className="flex w-full justify-around gap-4 pt-4 border-t border-zinc-900/50">
          <div className="text-center">
            <p className="text-[7px] text-zinc-600 font-pixel uppercase mb-1">Creators</p>
            <p className="text-lg font-bold font-mono text-emerald-500">{stats.yearly.creators}</p>
          </div>
          <div className="text-center">
            <p className="text-[7px] text-zinc-600 font-pixel uppercase mb-1">Consumers</p>
            <p className="text-lg font-bold font-mono text-red-500">{stats.yearly.consumers}</p>
          </div>
        </div>
      </section>

      {/* Density Grid Section */}
      <section className="border border-zinc-900 p-8 rounded-[40px] bg-zinc-950/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 font-pixel">Yearly Density</h3>
          <span className="text-[9px] font-bold font-mono text-zinc-600">{currentYear}</span>
        </div>
        <DensityGrid />
        <div className="mt-6 flex justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-[0.5px]" />
            <span className="text-[6px] font-bold font-pixel uppercase text-zinc-700 tracking-widest">Creator</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-[0.5px]" />
            <span className="text-[6px] font-bold font-pixel uppercase text-zinc-700 tracking-widest">Consumer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-zinc-900 rounded-[0.5px]" />
            <span className="text-[6px] font-bold font-pixel uppercase text-zinc-700 tracking-widest">Empty</span>
          </div>
        </div>
      </section>
      
      {/* Monthly Metrics */}
      <section className="grid grid-cols-2 gap-4">
        <div className="border border-zinc-900 p-6 rounded-[30px] bg-zinc-950/40">
          <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em] font-pixel mb-4">Monthly Flow</p>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-zinc-400 font-mono">Create</span>
            <span className="text-xl font-bold font-mono text-emerald-500">{stats.monthly.creators}</span>
          </div>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-[10px] text-zinc-400 font-mono">Consume</span>
            <span className="text-xl font-bold font-mono text-red-500">{stats.monthly.consumers}</span>
          </div>
        </div>
        <div className="border border-zinc-900 p-6 rounded-[30px] bg-zinc-950/40 flex flex-col justify-center items-center">
           <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em] font-pixel mb-2 text-center w-full">Current Month</p>
           <div className="text-2xl font-black font-mono">
             {Math.round(stats.monthly.ratio * 100)}%
           </div>
           <p className="text-[7px] text-zinc-700 font-mono uppercase mt-1 tracking-tighter">Efficiency</p>
        </div>
      </section>
    </div>
  );
};

export default Insights;
