import { create } from 'zustand';
import { Medication } from '../types';
import { medicationApi, AddMedicationInput } from '../api/medication.api';

interface MedicationState {
  medications: Medication[];
  isLoading: boolean;
  error: string | null;

  fetchMedications: (includeInactive?: boolean) => Promise<void>;
  addMedication: (data: AddMedicationInput) => Promise<Medication>;
  updateMedication: (
    id: string,
    data: Partial<AddMedicationInput>
  ) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  updateStock: (id: string, stockCount: number) => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  getMedicationById: (id: string) => Medication | undefined;
  clearError: () => void;
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
  medications: [],
  isLoading: false,
  error: null,

  fetchMedications: async (includeInactive = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await medicationApi.getMedications(includeInactive);
      set({ medications: response.medications });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch medications';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  addMedication: async (data: AddMedicationInput) => {
    const response = await medicationApi.addMedication(data);
    set((state) => ({
      medications: [response.medication, ...state.medications],
    }));
    return response.medication;
  },

  updateMedication: async (
    id: string,
    data: Partial<AddMedicationInput>
  ) => {
    const response = await medicationApi.updateMedication(id, data);
    set((state) => ({
      medications: state.medications.map((m) =>
        m.id === id ? response.medication : m
      ),
    }));
  },

  deleteMedication: async (id: string) => {
    await medicationApi.deleteMedication(id);
    set((state) => ({
      medications: state.medications.filter((m) => m.id !== id),
    }));
  },

  updateStock: async (id: string, stockCount: number) => {
    const response = await medicationApi.updateStock(id, stockCount);
    set((state) => ({
      medications: state.medications.map((m) =>
        m.id === id ? response.medication : m
      ),
    }));
  },

  toggleActive: async (id: string, isActive: boolean) => {
    const response = await medicationApi.toggleActive(id, isActive);
    set((state) => ({
      medications: state.medications.map((m) =>
        m.id === id ? response.medication : m
      ),
    }));
  },

  getMedicationById: (id: string) => {
    return get().medications.find((m) => m.id === id);
  },

  clearError: () => {
    set({ error: null });
  },
}));
