import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { employeeService } from '@/services/employee.service';
import type { Employee, EmployeeFilters, Pagination } from '@/types/employee.types';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  pagination: Pagination;
  filters: EmployeeFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  pagination: { page: 1, limit: 10, total: 0, pages: 0 },
  filters: { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' },
  isLoading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (filters: EmployeeFilters, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployees(filters);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const fetchEmployee = createAsyncThunk(
  'employees/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployee(id);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedEmployee(state) {
      state.selectedEmployee = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload.employees;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEmployee = action.payload;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearSelectedEmployee, clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
