'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { employeeService } from '@/services/employee.service';
import { useEmployees } from '@/hooks/useEmployees';
import { useAuth } from '@/context/AuthContext';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { EmployeeFiltersBar } from '@/components/employees/EmployeeFilters';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';

export default function EmployeesPage() {
  const { employees, pagination, filters, isLoading, loadEmployees, updateFilters, goToPage } =
    useEmployees();
  const { canAccess } = useAuth();
  const csvRef = useRef<HTMLInputElement>(null);
  const [csvLoading, setCsvLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee? This action can be undone within 30 days.')) return;
    try {
      await employeeService.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      loadEmployees(filters);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvLoading(true);
    try {
      const result = await employeeService.importCSV(file);
      toast.success(`Import done: ${result.created} created, ${result.failed} failed`);
      if (result.failed > 0) {
        console.warn('CSV import errors:', result.errors);
      }
      loadEmployees(filters);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'CSV import failed');
    } finally {
      setCsvLoading(false);
      if (csvRef.current) csvRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employees</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {pagination.total} total employee{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {canAccess('csv:import') && (
            <>
              <input
                ref={csvRef}
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
                id="csv-upload"
                aria-label="Import CSV"
              />
              <label
                htmlFor="csv-upload"
                className={`btn-secondary text-sm cursor-pointer ${csvLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-busy={csvLoading}
              >
                {csvLoading ? 'Importing…' : '📥 Import CSV'}
              </label>
            </>
          )}
          {canAccess('employee:create') && (
            <Link href="/employees/new" className="btn-primary text-sm">
              + Add Employee
            </Link>
          )}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="card p-4 space-y-3">
        <SearchBar
          value={filters.search || ''}
          placeholder="Search by name, email or ID…"
          onSearch={(v) => updateFilters({ search: v })}
        />
        <EmployeeFiltersBar filters={filters} onChange={updateFilters} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <EmployeeTable employees={employees} isLoading={isLoading} onDelete={handleDelete} />
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={goToPage}
        />
      </div>
    </div>
  );
}
