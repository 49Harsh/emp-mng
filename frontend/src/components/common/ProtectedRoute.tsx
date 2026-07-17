'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader } from './Loader';
import Cookies from 'js-cookie';
import type { Role } from '@/types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  // Track whether we've already attempted a refresh this mount — prevents repeated calls
  const hasAttemptedRefresh = useRef(false);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    // Only try to refresh once per mount, and only when not already authenticated/loading
    if (!isAuthenticated && !isLoading && !hasAttemptedRefresh.current) {
      hasAttemptedRefresh.current = true;
      refreshUser();
    }
  // refreshUser is now stable (useCallback), so this is safe
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <Loader fullPage />;

  if (!isAuthenticated) return <Loader fullPage />;

  if (roles && user && !roles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Access Denied
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            You don&apos;t have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
