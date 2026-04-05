import { useEffect, useCallback } from 'react';
import { useTimelineStore } from '../stores/timelineStore';

export const useTimeline = (date?: string) => {
  const {
    timeline,
    isLoading,
    error,
    fetchTimeline,
    markMedication,
    clearError,
  } = useTimelineStore();

  useEffect(() => {
    fetchTimeline(date);
  }, [date, fetchTimeline]);

  const refresh = useCallback(() => {
    fetchTimeline(date);
  }, [date, fetchTimeline]);

  const handleMarkMedication = useCallback(
    async (
      medicationId: string,
      scheduledTime: string,
      status: 'taken' | 'skipped'
    ) => {
      return markMedication(medicationId, scheduledTime, status);
    },
    [markMedication]
  );

  return {
    timeline,
    isLoading,
    error,
    refresh,
    markMedication: handleMarkMedication,
    clearError,
  };
};
