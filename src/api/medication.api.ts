import { apiClient } from './client';
import { Medication } from '../types';

export interface AddMedicationInput {
  name: string;
  name_bn?: string;
  dosage: string;
  frequency: string;
  times: string[];
  duration?: number;
  start_date: string;
  notes?: string;
  pharmacy_id?: string;
  stock_count?: number;
  refill_alert_days?: number;
}

export const medicationApi = {
  addMedication: (data: AddMedicationInput) =>
    apiClient.post<{ medication: Medication }>('/medications', data),

  getMedications: (includeInactive?: boolean) =>
    apiClient.get<{ medications: Medication[] }>('/medications', {
      includeInactive,
    }),

  getMedication: (id: string) =>
    apiClient.get<{ medication: Medication }>(`/medications/${id}`),

  updateMedication: (
    id: string,
    data: Partial<AddMedicationInput>
  ) =>
    apiClient.put<{ medication: Medication }>(`/medications/${id}`, data),

  deleteMedication: (id: string) =>
    apiClient.delete<{ medication: Medication }>(`/medications/${id}`),

  getRefillPending: () =>
    apiClient.get<{ medications: Medication[] }>('/medications/refill-pending'),

  updateStock: (id: string, stockCount: number) =>
    apiClient.put<{ medication: Medication }>(`/medications/${id}/stock`, {
      stockCount,
    }),

  toggleActive: (id: string, isActive: boolean) =>
    apiClient.put<{ medication: Medication }>(`/medications/${id}/toggle`, {
      isActive,
    }),
};
