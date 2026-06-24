import React from 'react';
import { ShieldCheck, Clock, FileText, BarChart } from 'lucide-react';

const StatisticsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Incidents',
      value: stats?.total || 0,
      icon: FileText,
      color: 'text-neon-blue',
      borderColor: 'border-neon-blue/20',
      bgGlow: 'bg-neon-blue/5'
    },
    {
      title: 'Active / Pending',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'text-yellow-400',
      borderColor: 'border-yellow-500/20',
      bgGlow: 'bg-yellow-500/5'
    },
    {
      title: 'Resolved Piles',
      value: stats?.resolved || 0,
      icon: ShieldCheck,
      color: 'text-neon-teal',
      borderColor: 'border-neon-teal/20',
      bgGlow: 'bg-neon-teal/5'
    },
    {
      title: 'Total Active Teams',
      value: stats?.approved || 0,
      icon: BarChart,
      color: 'text-neon-purple',
      borderColor: 'border-neon-purple/20',
      bgGlow: 'bg-neon-purple/5'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx} 
            className={`glass p-6 rounded-xl border ${card.borderColor} ${card.bgGlow} transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{card.title}</span>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-white">
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
