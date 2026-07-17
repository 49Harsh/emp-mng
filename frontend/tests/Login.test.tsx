import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm } from '../src/components/auth/LoginForm';

describe('LoginForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders email and password fields', () => {
    render(<LoginForm onSubmit={mockSubmit} isLoading={false} />);
    // Use getByLabelText with exact label text to avoid ambiguity
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<LoginForm onSubmit={mockSubmit} isLoading={false} />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty submission', async () => {
    render(<LoginForm onSubmit={mockSubmit} isLoading={false} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('shows error alert when error prop is passed', () => {
    render(<LoginForm onSubmit={mockSubmit} isLoading={false} error="Invalid credentials" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('disables submit button when loading', () => {
    render(<LoginForm onSubmit={mockSubmit} isLoading={true} />);
    // When loading the Loader spinner is shown inside the button; check disabled state via aria
    const submitBtn = screen.getByRole('button', { name: /loading/i });
    expect(submitBtn).toBeDisabled();
  });

  it('calls onSubmit with valid data', async () => {
    render(<LoginForm onSubmit={mockSubmit} isLoading={false} />);
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'admin@ems.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Admin@12345' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        { email: 'admin@ems.com', password: 'Admin@12345' },
        expect.anything()
      );
    });
  });

  it('toggles password visibility', () => {
    render(<LoginForm onSubmit={mockSubmit} isLoading={false} />);
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /show password/i }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
