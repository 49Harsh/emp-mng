import api from './api';
import type { OrgNode, Employee } from '@/types/employee.types';

export const organizationService = {
  getTree: async (): Promise<OrgNode[]> => {
    const { data } = await api.get('/organization/tree');
    return data.data.tree;
  },

  getReportees: async (id: string): Promise<Employee[]> => {
    const { data } = await api.get(`/organization/${id}/reportees`);
    return data.data.reportees;
  },

  updateManager: async (id: string, managerId: string | null): Promise<Employee> => {
    const { data } = await api.patch(`/organization/${id}/manager`, { managerId });
    return data.data.employee;
  },

  getDashboardStats: async () => {
    const { data } = await api.get('/dashboard');
    return data.data;
  },
};
