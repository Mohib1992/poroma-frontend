export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  gender?: string;
  age_range?: string;
  district?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Medication {
  id: string;
  name: string;
  name_bn?: string;
  dosage: string;
  frequency: FrequencyType;
  times: string[];
  duration?: number;
  start_date: string;
  end_date?: string;
  notes?: string;
  pharmacy_id?: string;
  stock_count?: number;
  refill_alert_days: number;
  is_active: boolean;
  pharmacy?: Pharmacy;
  logs?: MedicationLog[];
}

export type FrequencyType =
  | 'once_daily'
  | 'twice_daily'
  | 'three_times'
  | 'four_times'
  | 'as_needed'
  | 'weekly';

export interface MedicationLog {
  id: string;
  medication_id: string;
  scheduled_time: string;
  status: 'taken' | 'skipped' | 'pending';
  taken_at?: string;
  skipped_at?: string;
  date: string;
}

export interface TimelineEntry {
  id: string;
  medication_id: string;
  name: string;
  dosage: string;
  scheduled_time: string;
  status: 'taken' | 'skipped' | 'pending';
  taken_at?: string;
}

export interface TimelineResponse {
  date: string;
  summary: {
    total: number;
    taken: number;
    skipped: number;
    pending: number;
  };
  medications: TimelineEntry[];
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  area: string;
  district: string;
  lat?: number;
  lng?: number;
  phone?: string;
  has_delivery: boolean;
  tier: 'basic' | 'partner' | 'premium' | 'exclusive';
  is_verified: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type MainStackParamList = {
  HomeTab: undefined;
  MedicationsTab: undefined;
  SettingsTab: undefined;
  Home: undefined;
  AddMedication: undefined;
  Medications: undefined;
  MedicationDetail: { id: string };
  Settings: undefined;
};
