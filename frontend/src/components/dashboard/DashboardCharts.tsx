'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import type { DashboardStats } from '@/types/employee.types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface DashboardChartsProps {
  data: DashboardStats;
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  const monthlyData = data.monthlyJoining.map((d) => ({
    name: MONTH_NAMES[d._id.month - 1],
    joined: d.count,
  }));

  const deptData = data.departmentBreakdown.slice(0, 6).map((d) => ({
    name: d.name,
    value: d.count,
  }));

  const roleData = data.roleBreakdown.map((r) => ({
    name: r.role.replace('_', ' '),
    value: r.count,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Joining Trend */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Monthly Joining Trend
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="joined" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Department Breakdown */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Employees by Department
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={deptData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {deptData.map((_, idx) => (
                <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Role Breakdown */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Employees by Role
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={roleData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
