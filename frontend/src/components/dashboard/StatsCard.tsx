import clsx from 'clsx';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: 'blue' | 'green' | 'red' | 'purple';
  subtitle?: string;
}

const colorMap = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
};

export function StatsCard({ title, value, icon, color = 'blue', subtitle }: StatsCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center text-2xl', colorMap[color])}>
          <span aria-hidden="true">{icon}</span>
        </div>
      </div>
    </div>
  );
}
