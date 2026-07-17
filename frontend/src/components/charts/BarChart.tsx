'use client';

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface BarChartProps {
  data: { name: string; value: number; [key: string]: unknown }[];
  dataKey?: string;
  color?: string;
  title?: string;
  height?: number;
  showLegend?: boolean;
}

export function BarChart({
  data,
  dataKey = 'value',
  color = '#3b82f6',
  title,
  height = 240,
  showLegend = false,
}: BarChartProps) {
  return (
    <div>
      {title && (
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, white)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: 12,
            }}
          />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
