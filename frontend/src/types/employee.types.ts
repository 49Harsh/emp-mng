import type { Role } from './auth.types';

export interface Department {
  _id: string;
  name: string;
  description?: string;
  head?: { _id: string; name: string; email: string; employeeId: string };
  employeeCount?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  department: Department | string;
  designation: string;
  salary?: number;
  joiningDate: string;
  status: 'active' | 'inactive';
  role: Role;
  reportingManager?: Employee | string | null;
  profileImage?: string | null;
  user?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  department: string;
  designation: string;
  salary?: number;
  joiningDate: string;
  status?: 'active' | 'inactive';
  role?: Role;
  reportingManager?: string | null;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
  salary?: number;
  joiningDate?: string;
  status?: 'active' | 'inactive';
  role?: Role;
  reportingManager?: string | null;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface OrgNode extends Omit<Employee, 'department' | 'reportingManager'> {
  department: Department;
  children: OrgNode[];
}

export interface DashboardStats {
  stats: {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    totalDepartments: number;
  };
  recentEmployees: Employee[];
  departmentBreakdown: { _id: string; name: string; count: number; active: number }[];
  roleBreakdown: { role: string; count: number }[];
  monthlyJoining: { _id: { year: number; month: number }; count: number }[];
}
