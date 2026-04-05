import { apiClient } from './client';
import { AuthResponse } from '../types';

export const authApi = {
  register: (phone: string, password: string, name?: string) =>
    apiClient.post<AuthResponse>('/auth/register', { phone, password, name }),

  login: (phone: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { phone, password }),

  refresh: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken }
    ),

  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refreshToken }),

  verifyPhone: (phone: string) =>
    apiClient.post<{ exists: boolean }>('/auth/verify-phone', { phone }),

  requestPasswordReset: (phone: string) =>
    apiClient.post('/auth/request-password-reset', { phone }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),
};
