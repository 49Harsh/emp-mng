import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Attach access token to every outgoing request
api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Shared refresh state: prevents multiple simultaneous refresh calls ---
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const processQueue = (newToken: string) => {
  refreshQueue.forEach((resolve) => resolve(newToken));
  refreshQueue = [];
};

const redirectToLogin = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// Auto-refresh on 401 (expired token) with queue to handle concurrent requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only attempt refresh on 401, and never retry the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh')
    ) {
      const refreshToken = Cookies.get('refreshToken');

      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      // If already refreshing, queue this request to retry once done
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((newToken: string) => {
            original._retry = true;
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const newToken: string = data.data.accessToken;

        // Persist new token (1 hour expiry)
        Cookies.set('accessToken', newToken, { expires: 1 / 24 });

        // Retry all queued requests with new token
        processQueue(newToken);

        // Retry original request
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        redirectToLogin();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
