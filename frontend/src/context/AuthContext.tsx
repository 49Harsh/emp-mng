'use client';

import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { loginThunk, logoutThunk, getMeThunk } from '@/store/authSlice';
import type { LoginRequest, User, Role } from '@/types/auth.types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (...roles: Role[]) => boolean;
  canAccess: (permission: string) => boolean;
}

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  super_admin: [
    'employee:create', 'employee:read', 'employee:update', 'employee:delete',
    'employee:assign_role', 'department:create', 'department:read',
    'department:update', 'department:delete', 'dashboard:read', 'organization:read',
  ],
  hr_manager: [
    'employee:create', 'employee:read', 'employee:update',
    'department:read', 'dashboard:read', 'organization:read',
  ],
  employee: ['employee:read_own', 'employee:update_own', 'organization:read'],
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
  hasRole: () => false,
  canAccess: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector((s: RootState) => s.auth);

  const login = async (credentials: LoginRequest) => {
    await dispatch(loginThunk(credentials)).unwrap();
  };

  const logout = async () => {
    await dispatch(logoutThunk());
  };

  const refreshUser = async () => {
    await dispatch(getMeThunk());
  };

  const hasRole = (...roles: Role[]) => {
    return user ? roles.includes(user.role) : false;
  };

  const canAccess = (permission: string) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, login, logout, refreshUser, hasRole, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
