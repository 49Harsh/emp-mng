'use client';

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

interface PieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
  title?: string;
  height?: number;
  donut?: boolean;
  showLegend?: boolean;
}

export function PieChart({
  data,
  colors = DEFAULT_COLORS,
  title,
  height = 240,
  donut = true,
  showLegend = true,
}: PieChartProps) {
  return (
    <div>
      {title && (
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={donut ? 55 : 0}
            outerRadius={85}
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: 12,
            }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => (
                <span className="text-slate-600 dark:text-slate-400">{value}</span>
              )}
            />
          )}
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}
