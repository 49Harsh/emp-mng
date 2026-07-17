'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login(values);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch {
      // error is shown via context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white text-3xl mb-4">
            🏢
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employee Management</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
        </div>

        {/* Demo credentials */}
        <div className="mt-6 card p-4 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Demo Credentials:</p>
          <p>🔑 Super Admin: <strong>admin@ems.com</strong> / <strong>Admin@12345</strong></p>
          <p>🔑 HR Manager: <strong>hr@ems.com</strong> / <strong>Hr@123456</strong></p>
          <p>🔑 Employee: <strong>alice@ems.com</strong> / <strong>Emp@123456</strong></p>
        </div>
      </div>
    </div>
  );
}
