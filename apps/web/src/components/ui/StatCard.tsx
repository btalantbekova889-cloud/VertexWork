import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
}

const colorMap = {
  blue:   { icon: 'bg-blue-50 text-blue-600',   border: 'border-l-blue-500' },
  green:  { icon: 'bg-green-50 text-green-600',  border: 'border-l-green-500' },
  yellow: { icon: 'bg-amber-50 text-amber-600',  border: 'border-l-amber-500' },
  red:    { icon: 'bg-red-50 text-red-600',       border: 'border-l-red-500' },
  purple: { icon: 'bg-purple-50 text-purple-600', border: 'border-l-purple-500' },
  indigo: { icon: 'bg-indigo-50 text-indigo-600', border: 'border-l-indigo-500' },
};

export default function StatCard({ label, value, change, positive, icon, color = 'blue' }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`bg-white rounded-lg border border-gray-200 border-l-4 ${c.border} p-4 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
          <p className="text-gray-900 text-xl font-bold truncate">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
              {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span>{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ml-3 ${c.icon}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
