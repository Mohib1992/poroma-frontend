import { z } from 'zod';

export const frequencyOptions = [
  { value: 'once_daily', label: 'Once Daily' },
  { value: 'twice_daily', label: 'Twice Daily' },
  { value: 'three_times', label: 'Three Times' },
  { value: 'four_times', label: 'Four Times' },
  { value: 'as_needed', label: 'As Needed' },
  { value: 'weekly', label: 'Weekly' },
] as const;

export const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const medicationSchema = z.object({
  name: z
    .string({ required_error: 'Medication name is required' })
    .min(1, 'Medication name is required')
    .max(200, 'Name must be less than 200 characters'),
  name_bn: z.string().optional(),
  dosage: z
    .string({ required_error: 'Dosage is required' })
    .min(1, 'Dosage is required')
    .max(100, 'Dosage must be less than 100 characters'),
  frequency: z.enum(
    ['once_daily', 'twice_daily', 'three_times', 'four_times', 'as_needed', 'weekly'],
    { required_error: 'Frequency is required' }
  ),
  times: z
    .array(
      z.string().regex(timeRegex, 'Invalid time format (HH:MM)')
    )
    .min(1, 'At least one time is required'),
  duration: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const num = parseInt(val, 10);
        return !isNaN(num) && num > 0;
      },
      { message: 'Duration must be a positive number' }
    ),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  stock_count: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 0;
      },
      { message: 'Stock count must be a non-negative number' }
    ),
  refill_alert_days: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const num = parseInt(val, 10);
        return !isNaN(num) && num > 0;
      },
      { message: 'Refill alert days must be a positive number' }
    ),
});

export const editMedicationSchema = medicationSchema.partial();

export type MedicationFormData = z.infer<typeof medicationSchema>;
export type EditMedicationFormData = z.infer<typeof editMedicationSchema>;
