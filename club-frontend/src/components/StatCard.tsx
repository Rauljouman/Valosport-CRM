import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  color?: 'red' | 'green' | 'black';
  icon: React.ReactNode;
}

export const StatCard = ({ title, value, color = 'black', icon }: StatCardProps) => {
  const colorClasses = {
    red: 'text-red-600',
    green: 'text-emerald-600',
    black: 'text-slate-900'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
          {icon}
        </div>
      </div>
      <h3 className={`text-2xl font-bold ${colorClasses[color]}`}>
        {value}
      </h3>
    </div>
  );
};