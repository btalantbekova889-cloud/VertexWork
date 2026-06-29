interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

export default function StatCard({ label, value, change, positive }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-2 leading-none">{value}</p>
      {change && (
        <p className={`text-xs mt-1.5 font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>{change}</p>
      )}
    </div>
  );
}
