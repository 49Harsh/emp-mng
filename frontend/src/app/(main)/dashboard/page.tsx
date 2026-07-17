'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { organizationService } from '@/services/organization.service';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { Loader } from '@/components/common/Loader';
import type { DashboardStats, Employee, Department } from '@/types/employee.types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    organizationService
      .getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader fullPage />;

  if (!stats) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 dark:text-slate-400">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Overview of your organization
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Employees"
          value={stats.stats.totalEmployees}
          icon="👥"
          color="blue"
        />
        <StatsCard
          title="Active"
          value={stats.stats.activeEmployees}
          icon="✅"
          color="green"
        />
        <StatsCard
          title="Inactive"
          value={stats.stats.inactiveEmployees}
          icon="⏸️"
          color="red"
        />
        <StatsCard
          title="Departments"
          value={stats.stats.totalDepartments}
          icon="🏢"
          color="purple"
        />
      </div>

      {/* Charts */}
      <DashboardCharts data={stats} />

      {/* Recent Employees */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Recent Employees</h2>
          <Link href="/employees" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {stats.recentEmployees.map((emp: Employee) => {
            const dept = emp.department as Department;
            return (
              <li key={emp._id}>
                <Link
                  href={`/employees/${emp._id}`}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm flex-shrink-0">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{emp.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {emp.designation} · {dept?.name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={emp.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                      {emp.status}
                    </span>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {emp.joiningDate ? format(new Date(emp.joiningDate), 'MMM yyyy') : ''}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
