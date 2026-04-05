import { create } from 'zustand';
import { TimelineResponse } from '../types';
import { logApi } from '../api/log.api';

interface TimelineState {
  timeline: TimelineResponse | null;
  isLoading: boolean;
  error: string | null;

  fetchTimeline: (date?: string) => Promise<void>;
  markMedication: (
    medicationId: string,
    scheduledTime: string,
    status: 'taken' | 'skipped'
  ) => Promise<void>;
  clearError: () => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  timeline: null,
  isLoading: false,
  error: null,

  fetchTimeline: async (date?: string) => {
    set({ isLoading: true, error: null });
    try {
      const timeline = await logApi.getTimeline(date);
      set({ timeline });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch timeline';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  markMedication: async (
    medicationId: string,
    scheduledTime: string,
    status: 'taken' | 'skipped'
  ) => {
    await logApi.markMedication(medicationId, scheduledTime, status);

    set((state) => {
      if (!state.timeline) return state;

      const updatedMedications = state.timeline.medications.map((m) =>
        m.medication_id === medicationId && m.scheduled_time === scheduledTime
          ? {
              ...m,
              status,
              taken_at:
                status === 'taken' ? new Date().toISOString() : undefined,
            }
          : m
      );

      const summary = {
        total: updatedMedications.length,
        taken: updatedMedications.filter((m) => m.status === 'taken').length,
        skipped: updatedMedications.filter((m) => m.status === 'skipped')
          .length,
        pending: updatedMedications.filter((m) => m.status === 'pending').length,
      };

      return {
        timeline: { ...state.timeline, medications: updatedMedications, summary },
      };
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
