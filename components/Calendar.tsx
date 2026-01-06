
import React, { useState } from 'react';
import { ActivityType } from '../types';

interface CalendarProps {
  logs: Record<string, ActivityType>;
}

const Calendar: React.FC<CalendarProps> = ({ logs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const activity = logs[dateStr];
      
      let dotColor = 'bg-transparent';
      if (activity === 'creator') dotColor = 'bg-emerald-500';
      if (activity === 'consumer') dotColor = 'bg-red-500';
      if (activity === 'balanced') dotColor = 'bg-yellow-400';

      days.push(
        <div 
          key={d} 
          className="aspect-square flex flex-col items-center justify-center gap-1 group cursor-default"
        >
          <span className={`text-[11px] ${activity ? 'text-white' : 'text-zinc-600'} font-medium`}>{d}</span>
          <div className={`w-1 h-1 rounded-full transition-all duration-500 ${dotColor} ${activity ? 'scale-100' : 'scale-0'}`} />
        </div>
      );
    }
    return days;
  };

  const getCount = (type: ActivityType) => {
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return Object.entries(logs).filter(([date, t]) => {
      return t === type && date.startsWith(monthPrefix);
    }).length;
  };

  return (
    <div className="p-8 pb-32 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-2xl font-extralight tracking-[0.2em] uppercase">{months[month]}</h2>
          <p className="text-zinc-600 text-[10px] font-bold tracking-[0.4em] uppercase mt-1">{year}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={prevMonth} className="text-zinc-600 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button onClick={nextMonth} className="text-zinc-600 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6 6 6"/></svg>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 text-center mb-4 opacity-30">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <span key={i} className="text-[9px] font-bold tracking-[0.2em]">{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {renderDays()}
      </div>

      <div className="mt-16 grid grid-cols-3 gap-px bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-900">
        <div className="bg-black p-4 text-center">
          <p className="text-[7px] text-zinc-500 uppercase tracking-[0.2em] mb-1 font-bold">Creation</p>
          <p className="text-xl font-light text-emerald-500 tracking-tighter">{getCount('creator')}</p>
        </div>
        <div className="bg-black p-4 text-center">
          <p className="text-[7px] text-zinc-500 uppercase tracking-[0.2em] mb-1 font-bold">Consumption</p>
          <p className="text-xl font-light text-red-500 tracking-tighter">{getCount('consumer')}</p>
        </div>
        <div className="bg-black p-4 text-center">
          <p className="text-[7px] text-zinc-500 uppercase tracking-[0.2em] mb-1 font-bold">Balanced</p>
          <p className="text-xl font-light text-yellow-400 tracking-tighter">{getCount('balanced')}</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
