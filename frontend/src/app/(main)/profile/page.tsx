'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { employeeService } from '@/services/employee.service';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import type { EmployeeFormValues } from '@/components/employees/EmployeeForm';
import { Loader } from '@/components/common/Loader';
import type { Employee } from '@/types/employee.types';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.employee) {
      setIsLoading(false);
      return;
    }
    // user.employee can be a string ID or a populated object — always extract the string ID
    const employeeId = typeof user.employee === 'object'
      ? (user.employee as { _id: string })._id
      : user.employee;

    employeeService
      .getEmployee(employeeId)
      .then(setEmployee)
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setIsLoading(false));
  }, [user?.employee]);

  const handleSubmit = async (data: EmployeeFormValues) => {
    if (!employee) return;
    setIsSubmitting(true);
    try {
      // Employees can only update their phone number
      await employeeService.updateEmployee(employee._id, {
        phone: data.phone,
      });
      await refreshUser();
      toast.success('Profile updated');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader fullPage />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          View and update your profile information
        </p>
      </div>

      {!employee ? (
        <div className="card p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            No employee record is linked to your account.
          </p>
        </div>
      ) : (
        <div className="card p-6 md:p-8">
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Employee ID:</span> {employee.employeeId}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Role:</span>{' '}
              <span className="capitalize">{employee.role.replace('_', ' ')}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 pt-1">
              Most fields are managed by HR and cannot be changed here.
            </p>
          </div>

          <EmployeeForm
            employee={employee}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
