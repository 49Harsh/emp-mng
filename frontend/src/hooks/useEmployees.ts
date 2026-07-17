import { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { fetchEmployees, setFilters } from '@/store/employeeSlice';
import type { EmployeeFilters } from '@/types/employee.types';

export const useEmployees = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, pagination, filters, isLoading, error } = useSelector(
    (s: RootState) => s.employees
  );

  // Keep a ref to the latest filters so callbacks don't go stale
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const loadEmployees = useCallback(
    (overrides?: EmployeeFilters) => {
      const merged = { ...filtersRef.current, ...overrides };
      dispatch(setFilters(merged));
      dispatch(fetchEmployees(merged));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: EmployeeFilters) => {
      const merged = { ...filtersRef.current, ...newFilters, page: 1 };
      dispatch(setFilters(merged));
      dispatch(fetchEmployees(merged));
    },
    [dispatch]
  );

  const goToPage = useCallback(
    (page: number) => {
      const merged = { ...filtersRef.current, page };
      dispatch(setFilters(merged));
      dispatch(fetchEmployees(merged));
    },
    [dispatch]
  );

  return { employees, pagination, filters, isLoading, error, loadEmployees, updateFilters, goToPage };
};
