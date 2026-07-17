'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Link from 'next/link';
import { employeeService } from '@/services/employee.service';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import type { EmployeeFormValues } from '@/components/employees/EmployeeForm';

export default function NewEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      await employeeService.createEmployee({
        name: data.name,
        email: data.email,
        password: data.password ?? '',
        phone: data.phone,
        department: data.department,
        designation: data.designation,
        salary: data.salary,
        joiningDate: data.joiningDate,
        status: data.status,
        role: data.role,
        reportingManager: data.reportingManager || undefined,
      });
      toast.success('Employee created successfully');
      router.push('/employees');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/employees"
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add Employee</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create a new employee record
          </p>
        </div>
      </div>

      <div className="card p-6 md:p-8">
        <EmployeeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
