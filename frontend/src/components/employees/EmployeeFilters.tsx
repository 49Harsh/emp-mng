'use client';

import { useEffect, useState } from 'react';
import { employeeService } from '@/services/employee.service';
import type { Department, EmployeeFilters } from '@/types/employee.types';

interface EmployeeFiltersProps {
  filters: EmployeeFilters;
  onChange: (filters: Partial<EmployeeFilters>) => void;
}

const ROLES = [
  { value: '', label: 'All Roles' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'hr_manager', label: 'HR Manager' },
  { value: 'employee', label: 'Employee' },
];

const STATUSES = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'name', label: 'Name' },
  { value: 'joiningDate', label: 'Joining Date' },
  { value: 'salary', label: 'Salary' },
];

export function EmployeeFiltersBar({ filters, onChange }: EmployeeFiltersProps) {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    employeeService.getDepartments().then(setDepartments).catch(console.error);
  }, []);

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={filters.department || ''}
        onChange={(e) => onChange({ department: e.target.value || undefined })}
        className="input w-auto min-w-[140px]"
        aria-label="Filter by department"
      >
        <option value="">All Departments</option>
        {departments.map((d) => (
          <option key={d._id} value={d._id}>{d.name}</option>
        ))}
      </select>

      <select
        value={filters.role || ''}
        onChange={(e) => onChange({ role: e.target.value || undefined })}
        className="input w-auto min-w-[120px]"
        aria-label="Filter by role"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>

      <select
        value={filters.status || ''}
        onChange={(e) => onChange({ status: e.target.value || undefined })}
        className="input w-auto min-w-[120px]"
        aria-label="Filter by status"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <select
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => onChange({ sortBy: e.target.value })}
          className="input w-auto min-w-[130px]"
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          onClick={() => onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
          className="btn-secondary px-3 py-2"
          aria-label={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          {filters.sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
}
