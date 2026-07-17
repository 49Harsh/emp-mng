'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { Employee } from '@/types/employee.types';
import type { Department } from '@/types/employee.types';
import { useAuth } from '@/context/AuthContext';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function EmployeeTable({ employees, isLoading, onDelete }: EmployeeTableProps) {
  const { canAccess } = useAuth();

  if (isLoading) {
    return (
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-4xl" aria-hidden="true">👥</span>
        <p className="mt-3 text-slate-500 dark:text-slate-400">No employees found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <th className="text-left px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Employee</th>
            <th className="text-left px-6 py-3 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Dept / Designation</th>
            <th className="text-left px-6 py-3 font-medium text-slate-500 dark:text-slate-400 hidden lg:table-cell">Joining Date</th>
            <th className="text-left px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Status</th>
            <th className="text-left px-6 py-3 font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">Role</th>
            <th className="text-right px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {employees.map((emp) => {
            const dept = emp.department as Department;
            const imgSrc = emp.profileImage
              ? `${API_URL}/uploads/${emp.profileImage}`
              : null;

            return (
              <tr
                key={emp._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900 flex-shrink-0">
                      {imgSrc ? (
                        <Image src={imgSrc} alt={emp.name} fill className="object-cover" />
                      ) : (
                        <span className="flex items-center justify-center h-full text-primary-700 dark:text-primary-300 font-semibold text-sm">
                          {emp.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{emp.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{emp.email}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{emp.employeeId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <p className="text-slate-800 dark:text-slate-200">{dept?.name || '—'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{emp.designation}</p>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell text-slate-600 dark:text-slate-400">
                  {emp.joiningDate ? format(new Date(emp.joiningDate), 'MMM d, yyyy') : '—'}
                </td>
                <td className="px-6 py-4">
                  <span className={emp.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                    {emp.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/employees/${emp._id}`}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      View
                    </Link>
                    {canAccess('employee:update') && (
                      <Link
                        href={`/employees/${emp._id}/edit`}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:underline font-medium"
                      >
                        Edit
                      </Link>
                    )}
                    {canAccess('employee:delete') && (
                      <button
                        onClick={() => onDelete(emp._id)}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
                        aria-label={`Delete ${emp.name}`}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
