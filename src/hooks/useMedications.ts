import { useEffect, useCallback } from 'react';
import { useMedicationStore } from '../stores/medicationStore';
import { AddMedicationInput } from '../api/medication.api';

export const useMedications = (includeInactive = false) => {
  const {
    medications,
    isLoading,
    error,
    fetchMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    updateStock,
    toggleActive,
    getMedicationById,
    clearError,
  } = useMedicationStore();

  useEffect(() => {
    fetchMedications(includeInactive);
  }, [includeInactive]);

  const refresh = useCallback(() => {
    fetchMedications(includeInactive);
  }, [includeInactive]);

  const handleAddMedication = useCallback(
    async (data: AddMedicationInput) => {
      return addMedication(data);
    },
    [addMedication]
  );

  const handleUpdateMedication = useCallback(
    async (id: string, data: Partial<AddMedicationInput>) => {
      return updateMedication(id, data);
    },
    [updateMedication]
  );

  const handleDeleteMedication = useCallback(
    async (id: string) => {
      return deleteMedication(id);
    },
    [deleteMedication]
  );

  const handleUpdateStock = useCallback(
    async (id: string, stockCount: number) => {
      return updateStock(id, stockCount);
    },
    [updateStock]
  );

  const handleToggleActive = useCallback(
    async (id: string, isActive: boolean) => {
      return toggleActive(id, isActive);
    },
    [toggleActive]
  );

  return {
    medications,
    isLoading,
    error,
    refresh,
    addMedication: handleAddMedication,
    updateMedication: handleUpdateMedication,
    deleteMedication: handleDeleteMedication,
    updateStock: handleUpdateStock,
    toggleActive: handleToggleActive,
    getMedicationById,
    clearError,
  };
};
