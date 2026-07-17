'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { employeeService } from '@/services/employee.service';
import { useAuth } from '@/context/AuthContext';
import type { Employee, Department } from '@/types/employee.types';
import { Loader } from '@/components/common/Loader';

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  phone: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required').max(100),
  salary: z.coerce.number().min(0).optional(),
  joiningDate: z.string().min(1, 'Joining date is required'),
  status: z.enum(['active', 'inactive']).default('active'),
  role: z.enum(['super_admin', 'hr_manager', 'employee']).default('employee'),
  reportingManager: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: EmployeeFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function EmployeeForm({ employee, onSubmit, isSubmitting }: EmployeeFormProps) {
  const { canAccess, user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const isEdit = !!employee;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee
      ? {
          name: employee.name,
          email: employee.email,
          phone: employee.phone || '',
          department: typeof employee.department === 'object' ? employee.department._id : employee.department,
          designation: employee.designation,
          salary: employee.salary,
          joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '',
          status: employee.status,
          role: employee.role,
          reportingManager:
            employee.reportingManager
              ? typeof employee.reportingManager === 'object'
                ? (employee.reportingManager as Employee)._id
                : employee.reportingManager as string
              : '',
        }
      : { status: 'active', role: 'employee' },
  });

  useEffect(() => {
    employeeService.getDepartments().then(setDepartments).catch(console.error);
    employeeService
      .getEmployees({ limit: 100, status: 'active' })
      .then(({ employees }) => {
        setManagers(employees.filter((e) => e._id !== employee?._id));
      })
      .catch(console.error);
  }, [employee?._id]);

  const canAssignRole = canAccess('employee:assign_role');
  const canAssignManager = canAccess('employee:assign_manager') || canAccess('employee:update');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Personal Info */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input id="name" {...register('name')} className="input" placeholder="John Doe" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input id="email" type="email" {...register('email')} className="input" placeholder="john@company.com" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {!isEdit && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input id="password" type="password" {...register('password')} className="input" placeholder="Min 8 characters" />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
          )}

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Phone
            </label>
            <input id="phone" {...register('phone')} className="input" placeholder="+1 234 567 8900" />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      {/* Employment Info */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select id="department" {...register('department')} className="input">
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
            {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
          </div>

          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <input id="designation" {...register('designation')} className="input" placeholder="Software Engineer" />
            {errors.designation && <p className="mt-1 text-xs text-red-500">{errors.designation.message}</p>}
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Salary
            </label>
            <input id="salary" type="number" {...register('salary')} className="input" placeholder="75000" min={0} />
            {errors.salary && <p className="mt-1 text-xs text-red-500">{errors.salary.message}</p>}
          </div>

          <div>
            <label htmlFor="joiningDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Joining Date <span className="text-red-500">*</span>
            </label>
            <input id="joiningDate" type="date" {...register('joiningDate')} className="input" />
            {errors.joiningDate && <p className="mt-1 text-xs text-red-500">{errors.joiningDate.message}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select id="status" {...register('status')} className="input">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {canAssignRole && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Role
              </label>
              <select id="role" {...register('role')} className="input">
                <option value="employee">Employee</option>
                <option value="hr_manager">HR Manager</option>
                {user?.role === 'super_admin' && <option value="super_admin">Super Admin</option>}
              </select>
            </div>
          )}

          {canAssignManager && (
            <div>
              <label htmlFor="reportingManager" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Reporting Manager
              </label>
              <select id="reportingManager" {...register('reportingManager')} className="input">
                <option value="">None</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} — {m.designation}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={() => window.history.back()} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[120px]">
          {isSubmitting ? <Loader size="sm" /> : isEdit ? 'Save Changes' : 'Create Employee'}
        </button>
      </div>
    </form>
  );
}
