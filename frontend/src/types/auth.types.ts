export type Role = 'super_admin' | 'hr_manager' | 'employee';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  lastLogin?: string;
  employee?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
