export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HR_MANAGER: 'hr_manager',
  EMPLOYEE: 'employee',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  hr_manager: 'HR Manager',
  employee: 'Employee',
};

export const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const UPLOADS_URL = API_URL.replace('/api', '') + '/uploads';

export const PAGINATION_LIMITS = [10, 25, 50, 100];
