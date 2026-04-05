import { apiClient } from './client';

export interface UserStats {
  total_medications: number;
  total_logs: number;
  taken: number;
  skipped: number;
  adherence_rate: number;
}

export interface AdherenceData {
  date: string;
  adherence_rate: number;
  taken: number;
  total: number;
}

export const analyticsApi = {
  trackEvent: (eventType: string, eventData: Record<string, unknown>) =>
    apiClient.post('/analytics/event', {
      event_type: eventType,
      event_data: eventData,
    }),

  getUserStats: () => apiClient.get<{ stats: UserStats }>('/analytics/stats'),

  getAdherenceHistory: (days: number) =>
    apiClient.get<{ history: AdherenceData[] }>('/analytics/adherence', {
      days,
    }),
};
