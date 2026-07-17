import api from './api';
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeFilters,
  Pagination,
  Department,
} from '@/types/employee.types';

export const employeeService = {
  getEmployees: async (
    filters: EmployeeFilters
  ): Promise<{ employees: Employee[]; pagination: Pagination }> => {
    const { data } = await api.get('/employees', { params: filters });
    return { employees: data.data, pagination: data.pagination };
  },

  getEmployee: async (id: string): Promise<Employee> => {
    const { data } = await api.get(`/employees/${id}`);
    return data.data.employee;
  },

  createEmployee: async (payload: CreateEmployeeRequest): Promise<Employee> => {
    const { data } = await api.post('/employees', payload);
    return data.data.employee;
  },

  updateEmployee: async (id: string, payload: UpdateEmployeeRequest): Promise<Employee> => {
    const { data } = await api.put(`/employees/${id}`, payload);
    return data.data.employee;
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  uploadProfileImage: async (id: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const { data } = await api.post(`/employees/${id}/profile-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.profileImage;
  },

  importCSV: async (file: File): Promise<{ created: number; failed: number; errors: unknown[] }> => {
    const formData = new FormData();
    formData.append('csvFile', file);
    const { data } = await api.post('/employees/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  getDepartments: async (): Promise<Department[]> => {
    const { data } = await api.get('/departments', { params: { limit: 100 } });
    return data.data;
  },
};
