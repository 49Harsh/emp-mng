import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { authService } from '@/services/auth.service';
import type { AuthState, LoginRequest } from '@/types/auth.types';
import type { RootState } from './index';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      Cookies.set('accessToken', data.accessToken, { expires: 1 / 24 }); // 1 hour
      Cookies.set('refreshToken', data.refreshToken, { expires: 7 });
      return data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  const refreshToken = Cookies.get('refreshToken');
  if (refreshToken) {
    try {
      await authService.logout(refreshToken);
    } catch {
      // silently fail — token may already be expired
    }
  }
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
});

export const getMeThunk = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getMe();
    } catch {
      return rejectWithValue('Failed to fetch user');
    }
  },
  {
    // Skip if already loading or already authenticated — prevents concurrent/duplicate calls
    condition: (_, { getState }) => {
      const { auth } = getState() as RootState;
      if (auth.isLoading || auth.isAuthenticated) return false;
      return true;
    },
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.accessToken = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    });

    // GetMe
    builder
      .addCase(getMeThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getMeThunk.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setToken, clearError } = authSlice.actions;
export default authSlice.reducer;
