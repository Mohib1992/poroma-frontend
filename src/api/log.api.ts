import { apiClient } from './client';
import { TimelineResponse, MedicationLog } from '../types';

export const logApi = {
  markMedication: (
    medicationId: string,
    scheduledTime: string,
    status: 'taken' | 'skipped'
  ) =>
    apiClient.post<{ log: MedicationLog }>('/logs', {
      medication_id: medicationId,
      scheduled_time: scheduledTime,
      status,
    }),

  getTimeline: (date?: string) =>
    apiClient.get<TimelineResponse>('/logs/timeline', { date }),

  getMedicationLogs: (medicationId: string, days?: number) =>
    apiClient.get<{ logs: MedicationLog[] }>(
      `/logs/medication/${medicationId}`,
      { days }
    ),

  getHistory: (startDate: string, endDate: string) =>
    apiClient.get<{ logs: MedicationLog[] }>('/logs/history', {
      startDate,
      endDate,
    }),
};
