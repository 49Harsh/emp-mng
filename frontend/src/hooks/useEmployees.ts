import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { fetchEmployees, setFilters } from '@/store/employeeSlice';
import type { EmployeeFilters } from '@/types/employee.types';

export const useEmployees = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, pagination, filters, isLoading, error } = useSelector(
    (s: RootState) => s.employees
  );

  const loadEmployees = (overrides?: EmployeeFilters) => {
    const merged = { ...filters, ...overrides };
    dispatch(setFilters(merged));
    dispatch(fetchEmployees(merged));
  };

  const updateFilters = (newFilters: EmployeeFilters) => {
    const merged = { ...filters, ...newFilters, page: 1 };
    dispatch(setFilters(merged));
    dispatch(fetchEmployees(merged));
  };

  const goToPage = (page: number) => {
    const merged = { ...filters, page };
    dispatch(setFilters(merged));
    dispatch(fetchEmployees(merged));
  };

  return { employees, pagination, filters, isLoading, error, loadEmployees, updateFilters, goToPage };
};
