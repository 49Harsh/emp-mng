import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmployeeTable } from '../src/components/employees/EmployeeTable';
import type { Employee } from '../src/types/employee.types';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock auth context
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    canAccess: (perm: string) => ['employee:update', 'employee:delete'].includes(perm),
    user: { role: 'super_admin' },
  }),
}));

const mockEmployees: Employee[] = [
  {
    _id: '1',
    employeeId: 'EMP0001',
    name: 'Alice Smith',
    email: 'alice@test.com',
    phone: '+1234567890',
    department: { _id: 'dept1', name: 'Engineering', isActive: true, createdAt: '' },
    designation: 'Engineer',
    salary: 80000,
    joiningDate: '2023-01-15T00:00:00.000Z',
    status: 'active',
    role: 'employee',
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-01-15T00:00:00.000Z',
  },
  {
    _id: '2',
    employeeId: 'EMP0002',
    name: 'Bob Jones',
    email: 'bob@test.com',
    department: { _id: 'dept2', name: 'HR', isActive: true, createdAt: '' },
    designation: 'HR Manager',
    joiningDate: '2022-06-01T00:00:00.000Z',
    status: 'inactive',
    role: 'hr_manager',
    createdAt: '2022-06-01T00:00:00.000Z',
    updatedAt: '2022-06-01T00:00:00.000Z',
  },
];

describe('EmployeeTable', () => {
  let onDelete: jest.Mock;

  beforeEach(() => {
    onDelete = jest.fn();
  });

  it('renders employee rows', () => {
    render(<EmployeeTable employees={mockEmployees} isLoading={false} onDelete={onDelete} />);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('shows employee IDs', () => {
    render(<EmployeeTable employees={mockEmployees} isLoading={false} onDelete={onDelete} />);
    expect(screen.getByText('EMP0001')).toBeInTheDocument();
    expect(screen.getByText('EMP0002')).toBeInTheDocument();
  });

  it('shows active/inactive badges', () => {
    render(<EmployeeTable employees={mockEmployees} isLoading={false} onDelete={onDelete} />);
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('inactive')).toBeInTheDocument();
  });

  it('shows loading skeletons when isLoading is true', () => {
    const { container } = render(
      <EmployeeTable employees={[]} isLoading={true} onDelete={onDelete} />
    );
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('shows empty state when no employees', () => {
    render(<EmployeeTable employees={[]} isLoading={false} onDelete={onDelete} />);
    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<EmployeeTable employees={mockEmployees} isLoading={false} onDelete={onDelete} />);
    // The EmployeeTable calls onDelete directly; confirm is handled at page level
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith('1');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('shows View and Edit links for each employee', () => {
    render(<EmployeeTable employees={mockEmployees} isLoading={false} onDelete={onDelete} />);
    const viewLinks = screen.getAllByRole('link', { name: /view/i });
    expect(viewLinks).toHaveLength(2);
    const editLinks = screen.getAllByRole('link', { name: /edit/i });
    expect(editLinks).toHaveLength(2);
  });

  it('renders department names', () => {
    render(<EmployeeTable employees={mockEmployees} isLoading={false} onDelete={onDelete} />);
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('HR')).toBeInTheDocument();
  });
});
