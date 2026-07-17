import api from './api';
import type { LoginRequest, LoginResponse, User } from '@/types/auth.types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { refreshToken });
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string; user: User }> => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data.data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data.data.user;
  },
};
