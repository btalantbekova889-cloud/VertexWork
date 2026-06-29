import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
  color?: 'cyan' | 'green' | 'yellow' | 'red' | 'purple' | 'blue';
}

const colorMap = {
  cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400',
  green: 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400',
  yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20 text-yellow-400',
  red: 'from-red-500/20 to-red-600/10 border-red-500/20 text-red-400',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
};

export default function StatCard({ label, value, change, positive, icon, color = 'cyan' }: StatCardProps) {
  const cls = colorMap[color];
  return (
    <div className={`rounded-xl border bg-gradient-to-br p-5 ${cls}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
              {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center opacity-80 ${cls.split(' ').slice(0,2).join(' ')}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
