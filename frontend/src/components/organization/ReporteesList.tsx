'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Employee } from '@/types/employee.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface ReporteesListProps {
  reportees: Employee[];
  managerName: string;
}

export function ReporteesList({ reportees, managerName }: ReporteesListProps) {
  if (reportees.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 dark:text-slate-400">No direct reports for {managerName}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {reportees.length} direct report{reportees.length !== 1 ? 's' : ''} for {managerName}
      </p>
      <ul className="space-y-3">
        {reportees.map((emp) => {
          const imgSrc = emp.profileImage ? `${API_URL}/uploads/${emp.profileImage}` : null;
          const dept = typeof emp.department === 'object' ? emp.department : null;

          return (
            <li key={emp._id}>
              <Link
                href={`/employees/${emp._id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900 flex-shrink-0">
                  {imgSrc ? (
                    <Image src={imgSrc} alt={emp.name} fill className="object-cover" />
                  ) : (
                    <span className="flex items-center justify-center h-full text-primary-700 dark:text-primary-300 font-semibold">
                      {emp.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{emp.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {emp.designation} {dept ? `· ${dept.name}` : ''}
                  </p>
                </div>
                <span className={emp.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                  {emp.status}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
