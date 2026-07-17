'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { employeeService } from '@/services/employee.service';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import type { EmployeeFormValues } from '@/components/employees/EmployeeForm';
import { Loader } from '@/components/common/Loader';
import type { Employee } from '@/types/employee.types';

export default function EditEmployeePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    employeeService
      .getEmployee(id)
      .then(setEmployee)
      .catch(() => toast.error('Failed to load employee'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      // Don't send password on edit
      await employeeService.updateEmployee(id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        department: data.department,
        designation: data.designation,
        salary: data.salary,
        joiningDate: data.joiningDate,
        status: data.status,
        role: data.role,
        reportingManager: data.reportingManager || null,
      });
      toast.success('Employee updated successfully');
      router.push(`/employees/${id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader fullPage />;

  if (!employee) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 dark:text-slate-400">Employee not found.</p>
        <Link
          href="/employees"
          className="text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block"
        >
          Back to employees
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/employees/${id}`}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Employee</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{employee.name}</p>
        </div>
      </div>

      <div className="card p-6 md:p-8">
        <EmployeeForm employee={employee} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
