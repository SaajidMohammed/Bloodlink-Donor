import React from 'react';
import { Heart, Calendar, Award, Flame } from 'lucide-react';

/* Map rank label → medal emoji */
const rankMedal = { Platinum: '💎', Gold: '🥇', Silver: '🥈', Bronze: '🥉' };

const StatsOverview = ({ stats }) => {
  const cards = [
    {
      label: 'Total Donations',
      value: stats.total || '0',
      icon: Heart,
      bg: 'bg-rose-50',
      iconColor: 'text-rose-500',
      accent: 'border-rose-100',
    },
    {
      label: 'Last Donation',
      value: stats.lastDate || 'No donations yet',
      icon: Calendar,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      accent: 'border-blue-100',
      small: true,
    },
    {
      label: 'Impact Rank',
      value: `${rankMedal[stats.rank] || '🥉'} ${stats.rank || 'Bronze'}`,
      icon: Award,
      bg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      accent: 'border-amber-100',
    },
    {
      label: 'Lives Impacted',
      value: `~${(stats.total || 0) * 3}`,
      icon: Flame,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      accent: 'border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl border ${card.accent} shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}
        >
          <div className={`h-10 w-10 ${card.bg} ${card.iconColor} rounded-xl flex items-center justify-center`}>
            <card.icon size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
            <p className={`font-black text-slate-800 mt-0.5 ${card.small ? 'text-sm leading-snug' : 'text-xl'}`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;