# Frontend Development Instructions

## পরমা (Poroma) - Frontend Team

This document provides step-by-step instructions for building the React Native mobile application.

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo CLI (`npx expo start`)
- Android Studio (for Android development) - optional
- Xcode (for iOS development, macOS only) - optional

---

## Step 1: Project Setup

Navigate to the frontend directory:

```bash
cd poroma-frontend
```

Copy the example package file:

```bash
cp package.example.json package.json
```

Install dependencies:

```bash
npm install
```

**Expected output:** Successfully installed all dependencies.

---

## Step 2: Create Project Structure

Create the following directory structure:

```bash
mkdir -p src/{api,components/{common,medication,timeline,form},screens/{auth},navigation,stores,hooks,utils,types,validators}
```

---

## Step 3: Type Definitions

### 3.1 Create `src/types/index.ts`

```typescript
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

export type FrequencyType = 'once_daily' | 'twice_daily' | 'three_times' | 'four_times' | 'as_needed' | 'weekly';

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
  details?: any;
}
```

---

## Step 4: API Layer

### 4.1 Create `src/api/client.ts`

```typescript
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from '../types';

const BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1' 
  : 'https://api.poroma.app/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse<any>>) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                refreshToken,
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              await AsyncStorage.setItem('accessToken', accessToken);
              await AsyncStorage.setItem('refreshToken', newRefreshToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data.data as T;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data as T;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data.data as T;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data.data as T;
  }
}

export const apiClient = new ApiClient();
```

### 4.2 Create `src/api/auth.api.ts`

```typescript
import { apiClient } from './client';
import { AuthResponse } from '../types';

export const authApi = {
  register: (phone: string, password: string, name?: string) =>
    apiClient.post<AuthResponse>('/auth/register', { phone, password, name }),

  login: (phone: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { phone, password }),

  refresh: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refreshToken }),
};
```

### 4.3 Create `src/api/medication.api.ts`

```typescript
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
    apiClient.get<{ medications: Medication[] }>('/medications', { includeInactive }),

  getMedication: (id: string) =>
    apiClient.get<{ medication: Medication }>(`/medications/${id}`),

  updateMedication: (id: string, data: Partial<AddMedicationInput>) =>
    apiClient.put<{ medication: Medication }>(`/medications/${id}`, data),

  deleteMedication: (id: string) =>
    apiClient.delete<{ medication: Medication }>(`/medications/${id}`),

  getRefillPending: () =>
    apiClient.get<{ medications: Medication[] }>('/medications/refill-pending'),

  updateStock: (id: string, stockCount: number) =>
    apiClient.put<{ medication: Medication }>(`/medications/${id}/stock`, { stockCount }),
};
```

### 4.4 Create `src/api/log.api.ts`

```typescript
import { apiClient } from './client';
import { TimelineResponse, MedicationLog } from '../types';

export const logApi = {
  markMedication: (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') =>
    apiClient.post<{ log: MedicationLog }>('/logs', {
      medication_id: medicationId,
      scheduled_time: scheduledTime,
      status,
    }),

  getTimeline: (date?: string) =>
    apiClient.get<TimelineResponse>('/logs/timeline', { date }),

  getMedicationLogs: (medicationId: string, days?: number) =>
    apiClient.get<{ logs: MedicationLog[] }>(`/logs/medication/${medicationId}`, { days }),
};
```

### 4.5 Create `src/api/analytics.api.ts`

```typescript
import { apiClient } from './client';

export interface UserStats {
  total_medications: number;
  total_logs: number;
  taken: number;
  skipped: number;
  adherence_rate: number;
}

export const analyticsApi = {
  trackEvent: (eventType: string, eventData: any) =>
    apiClient.post('/analytics/event', { event_type: eventType, event_data: eventData }),

  getUserStats: () => apiClient.get<{ stats: UserStats }>('/analytics/stats'),
};
```

---

## Step 5: Validation Schemas

### Create `src/validators/auth.validator.ts`

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladesh phone number'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladesh phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
```

### Create `src/validators/medication.validator.ts`

```typescript
import { z } from 'zod';

export const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.enum(['once_daily', 'twice_daily', 'three_times', 'four_times', 'as_needed', 'weekly']),
  times: z.array(z.string().min(1)).min(1, 'At least one time is required'),
  duration: z.string().optional(),
  notes: z.string().optional(),
  stock_count: z.string().optional(),
});

export type MedicationForm = z.infer<typeof medicationSchema>;
```

---

## Step 6: Zustand Stores

### 6.1 Create `src/stores/authStore.ts`

```typescript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthResponse } from '../types';
import { authApi } from '../api/auth.api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (userJson && accessToken) {
        set({ user: JSON.parse(userJson), isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      set({ isInitialized: true });
    }
  },

  login: async (phone: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(phone, password);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      await AsyncStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      set({ user: response.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (phone: string, password: string, name?: string) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register(phone, password, name);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      await AsyncStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      set({ user: response.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
      set({ user: null, isAuthenticated: false });
    }
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },
}));
```

### 6.2 Create `src/stores/medicationStore.ts`

```typescript
import { create } from 'zustand';
import { Medication } from '../types';
import { medicationApi, AddMedicationInput } from '../api/medication.api';

interface MedicationState {
  medications: Medication[];
  isLoading: boolean;
  error: string | null;

  fetchMedications: () => Promise<void>;
  addMedication: (data: AddMedicationInput) => Promise<Medication>;
  updateMedication: (id: string, data: Partial<AddMedicationInput>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  updateStock: (id: string, stockCount: number) => Promise<void>;
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
  medications: [],
  isLoading: false,
  error: null,

  fetchMedications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await medicationApi.getMedications();
      set({ medications: response.medications });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addMedication: async (data: AddMedicationInput) => {
    const response = await medicationApi.addMedication(data);
    set((state) => ({ medications: [response.medication, ...state.medications] }));
    return response.medication;
  },

  updateMedication: async (id: string, data: Partial<AddMedicationInput>) => {
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
}));
```

### 6.3 Create `src/stores/timelineStore.ts`

```typescript
import { create } from 'zustand';
import { TimelineResponse } from '../types';
import { logApi } from '../api/log.api';

interface TimelineState {
  timeline: TimelineResponse | null;
  isLoading: boolean;
  error: string | null;

  fetchTimeline: (date?: string) => Promise<void>;
  markMedication: (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') => Promise<void>;
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
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  markMedication: async (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') => {
    await logApi.markMedication(medicationId, scheduledTime, status);
    
    set((state) => {
      if (!state.timeline) return state;

      const updatedMedications = state.timeline.medications.map((m) =>
        m.medication_id === medicationId && m.scheduled_time === scheduledTime
          ? { ...m, status, taken_at: status === 'taken' ? new Date().toISOString() : undefined }
          : m
      );

      const summary = {
        total: updatedMedications.length,
        taken: updatedMedications.filter((m) => m.status === 'taken').length,
        skipped: updatedMedications.filter((m) => m.status === 'skipped').length,
        pending: updatedMedications.filter((m) => m.status === 'pending').length,
      };

      return {
        timeline: { ...state.timeline, medications: updatedMedications, summary },
      };
    });
  },
}));
```

---

## Step 7: Custom Hooks

### Create `src/hooks/useAuth.ts`

```typescript
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, register, logout, updateUser } = useAuthStore();
  return { user, isAuthenticated, isLoading, login, register, logout, updateUser };
};
```

### Create `src/hooks/useMedications.ts`

```typescript
import { useEffect } from 'react';
import { useMedicationStore } from '../stores/medicationStore';

export const useMedications = () => {
  const { medications, isLoading, error, fetchMedications, addMedication, updateMedication, deleteMedication } =
    useMedicationStore();

  useEffect(() => {
    fetchMedications();
  }, []);

  return {
    medications,
    isLoading,
    error,
    refresh: fetchMedications,
    addMedication,
    updateMedication,
    deleteMedication,
  };
};
```

### Create `src/hooks/useTimeline.ts`

```typescript
import { useEffect, useCallback } from 'react';
import { useTimelineStore } from '../stores/timelineStore';

export const useTimeline = (date?: string) => {
  const { timeline, isLoading, error, fetchTimeline, markMedication } = useTimelineStore();

  useEffect(() => {
    fetchTimeline(date);
  }, [date]);

  const refresh = useCallback(() => fetchTimeline(date), [date]);

  return { timeline, isLoading, error, refresh, markMedication };
};
```

---

## Step 8: Navigation

### 8.1 Create `src/navigation/types.ts`

```typescript
import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  AddMedication: undefined;
  Medications: undefined;
  MedicationDetail: { id: string };
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

### 8.2 Create `src/navigation/AuthNavigator.tsx`

```typescript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};
```

### 8.3 Create `src/navigation/MainNavigator.tsx`

```typescript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { MedicationsScreen } from '../screens/MedicationsScreen';
import { AddMedicationScreen } from '../screens/AddMedicationScreen';
import { MedicationDetailScreen } from '../screens/MedicationDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { MainStackParamList } from './types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddMedication" component={AddMedicationScreen} options={{ title: 'Add Medication' }} />
      <Stack.Screen name="Medications" component={MedicationsScreen} />
      <Stack.Screen name="MedicationDetail" component={MedicationDetailScreen} options={{ title: 'Medication' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MedicationsTab') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={MainStack} options={{ title: 'Home' }} />
      <Tab.Screen name="MedicationsTab" component={MainStack} options={{ title: 'Medications' }} />
      <Tab.Screen name="SettingsTab" component={MainStack} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};
```

### 8.4 Create `src/navigation/RootNavigator.tsx`

```typescript
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { RootStackParamList } from './types';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

---

## Step 9: App Entry

### Create `src/App.tsx`

```typescript
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { useAuthStore } from './stores/authStore';

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
```

### Update `App.tsx` in root (copy content from src/App.tsx)

---

## Step 10: Screens

### 10.1 Create `src/screens/auth/LoginScreen.tsx`

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid phone number'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginScreen = ({ navigation }: any) => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.phone, data.password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>পরমা</Text>
          <Text style={styles.tagline}>Your medication companion</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Welcome Back</Text>

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  placeholder="+88017XXXXXXXX"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="phone-pad"
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Enter password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>
            )}
          />

          {error ? <Text style={styles.apiError}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  logo: { fontSize: 48, fontWeight: 'bold', color: '#2196F3' },
  tagline: { fontSize: 16, color: '#666', marginTop: 8 },
  form: { width: '100%' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16, fontSize: 16 },
  inputError: { borderColor: '#f44336' },
  errorText: { color: '#f44336', fontSize: 12, marginTop: 4 },
  apiError: { color: '#f44336', textAlign: 'center', marginBottom: 16 },
  button: { backgroundColor: '#2196F3', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#666', fontSize: 14 },
  linkTextBold: { color: '#2196F3', fontWeight: '600' },
});
```

### 10.2 Create `src/screens/auth/SignUpScreen.tsx`

(Similar structure to LoginScreen, with additional name and confirm password fields)

### 10.3 Create `src/screens/HomeScreen.tsx`

```typescript
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTimeline } from '../hooks/useTimeline';
import { useAuth } from '../hooks/useAuth';

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { timeline, isLoading, refresh } = useTimeline();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const pendingMeds = timeline?.medications.filter((m) => m.status === 'pending') || [];

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.userName}>{user?.name || 'Friend'}</Text>
        </View>
      </View>

      {isLoading && !timeline ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
      ) : (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Today's Progress</Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{timeline?.summary.taken || 0}</Text>
                <Text style={styles.statLabel}>Taken</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{pendingMeds.length}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{timeline?.summary.total || 0}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>

          {pendingMeds.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming</Text>
              {pendingMeds.map((med) => (
                <TouchableOpacity
                  key={`${med.medication_id}-${med.scheduled_time}`}
                  style={styles.medCard}
                  onPress={() => navigation.navigate('MedicationDetail', { id: med.medication_id })}
                >
                  <View style={styles.medInfo}>
                    <Text style={styles.medTime}>{med.scheduled_time}</Text>
                    <Text style={styles.medName}>{med.name}</Text>
                    <Text style={styles.medDosage}>{med.dosage}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.takeButton}
                    onPress={() => {
                      const { markMedication } = useTimeline();
                      markMedication(med.medication_id, med.scheduled_time, 'taken');
                    }}
                  >
                    <Text style={styles.takeButtonText}>Take</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {timeline?.summary.total === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💊</Text>
              <Text style={styles.emptyTitle}>No medications today</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddMedication')}>
                <Text style={styles.addButtonText}>Add Medication</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#2196F3' },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  loader: { marginTop: 40 },
  summaryCard: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 16, elevation: 2 },
  summaryTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 16 },
  summaryStats: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#2196F3' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#eee' },
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  medCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  medInfo: { flex: 1 },
  medTime: { fontSize: 14, color: '#2196F3', fontWeight: '600' },
  medName: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 4 },
  medDosage: { fontSize: 14, color: '#666' },
  takeButton: { backgroundColor: '#4CAF50', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  takeButtonText: { color: '#fff', fontWeight: '600' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 24 },
  addButton: { backgroundColor: '#2196F3', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: '600' },
});
```

### 10.4 Create `src/screens/AddMedicationScreen.tsx`

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useMedications } from '../hooks/useMedications';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { medicationSchema } from '../validators/medication.validator';

type MedicationForm = z.infer<typeof medicationSchema>;

const frequencyOptions = [
  { value: 'once_daily', label: 'Once Daily' },
  { value: 'twice_daily', label: 'Twice Daily' },
  { value: 'three_times', label: 'Three Times' },
];

export const AddMedicationScreen = ({ navigation }: any) => {
  const { addMedication } = useMedications();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<MedicationForm>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: '',
      dosage: '',
      frequency: 'once_daily',
      times: ['08:00'],
      notes: '',
      stock_count: '',
    },
  });

  const addTime = () => {
    const currentTimes = watch('times');
    setValue('times', [...currentTimes, '12:00']);
  };

  const onSubmit = async (data: MedicationForm) => {
    setIsLoading(true);
    try {
      await addMedication({
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        times: data.times,
        start_date: new Date().toISOString(),
        notes: data.notes,
        stock_count: data.stock_count ? parseInt(data.stock_count) : undefined,
      });
      Alert.alert('Success', 'Medication added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add medication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medication Name</Text>
              <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder="e.g., Metformin 500mg" onBlur={onBlur} onChangeText={onChange} value={value} />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="dosage"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dosage</Text>
              <TextInput style={[styles.input, errors.dosage && styles.inputError]} placeholder="e.g., 1 tablet" onBlur={onBlur} onChangeText={onChange} value={value} />
              {errors.dosage && <Text style={styles.errorText}>{errors.dosage.message}</Text>}
            </View>
          )}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Frequency</Text>
          <Controller
            control={control}
            name="frequency"
            render={({ field: { onChange, value } }) => (
              <View style={styles.optionsGrid}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity key={option.value} style={[styles.optionButton, value === option.value && styles.optionButtonActive]} onPress={() => onChange(option.value)}>
                    <Text style={[styles.optionText, value === option.value && styles.optionTextActive]}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>

        <Controller
          control={control}
          name="times"
          render={({ field: { value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reminder Times</Text>
              {value.map((time, index) => (
                <Controller
                  key={index}
                  control={control}
                  name={`times.${index}`}
                  render={({ field: { onChange, value: timeValue } }) => (
                    <TextInput style={styles.timeInput} placeholder="HH:MM" onChangeText={onChange} value={timeValue} keyboardType="numbers-and-punctuation" />
                  )}
                />
              ))}
              <TouchableOpacity style={styles.addTimeButton} onPress={addTime}>
                <Text style={styles.addTimeText}>+ Add Another Time</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Add Medication</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16, fontSize: 16 },
  inputError: { borderColor: '#f44336' },
  errorText: { color: '#f44336', fontSize: 12, marginTop: 4 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
  optionButtonActive: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  optionText: { fontSize: 14, color: '#666' },
  optionTextActive: { color: '#fff' },
  timeInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 8 },
  addTimeButton: { padding: 12, alignItems: 'center' },
  addTimeText: { color: '#2196F3', fontWeight: '600' },
  submitButton: { backgroundColor: '#2196F3', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
```

### 10.5 Create `src/screens/MedicationsScreen.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useMedications } from '../hooks/useMedications';

export const MedicationsScreen = ({ navigation }: any) => {
  const { medications, isLoading, refresh } = useMedications();

  return (
    <View style={styles.container}>
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.medCard} onPress={() => navigation.navigate('MedicationDetail', { id: item.id })}>
            <Text style={styles.medName}>{item.name}</Text>
            <Text style={styles.medDosage}>{item.dosage}</Text>
            <Text style={styles.medFrequency}>{item.frequency.replace('_', ' ')}</Text>
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        contentContainerStyle={medications.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💊</Text>
            <Text style={styles.emptyTitle}>No medications yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddMedication')}>
              <Text style={styles.addButtonText}>Add Medication</Text>
            </TouchableOpacity>
          </View>
        }
      />
      {medications.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddMedication')}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  medCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8 },
  medName: { fontSize: 16, fontWeight: '600', color: '#333' },
  medDosage: { fontSize: 14, color: '#666', marginTop: 4 },
  medFrequency: { fontSize: 12, color: '#2196F3', marginTop: 4 },
  emptyState: { alignItems: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 24 },
  addButton: { backgroundColor: '#2196F3', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabIcon: { fontSize: 28, color: '#fff', fontWeight: '300' },
});
```

### 10.6 Create `src/screens/SettingsScreen.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export const SettingsScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{user?.name || 'Not set'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user?.phone}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8, marginLeft: 4 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  infoLabel: { fontSize: 16, color: '#333' },
  infoValue: { fontSize: 16, color: '#666' },
  divider: { height: 1, backgroundColor: '#eee', marginHorizontal: 16 },
  logoutButton: { margin: 16, marginTop: 40, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#f44336' },
  logoutText: { color: '#f44336', fontSize: 16, fontWeight: '600' },
});
```

### 10.7 Create `src/screens/MedicationDetailScreen.tsx`

(Basic implementation - show medication details, edit, delete options)

---

## Files to Create

```
poroma-frontend/
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.api.ts
│   │   ├── medication.api.ts
│   │   ├── log.api.ts
│   │   └── analytics.api.ts
│   ├── components/
│   │   └── common/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignUpScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── AddMedicationScreen.tsx
│   │   ├── MedicationsScreen.tsx
│   │   ├── MedicationDetailScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/
│   │   ├── types.ts
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── medicationStore.ts
│   │   └── timelineStore.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useMedications.ts
│   │   └── useTimeline.ts
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   └── medication.validator.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
├── app.json
└── package.json
```

---

## Running the App

```bash
# Start Expo development server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

---

## API Connection

- Development: `http://localhost:3000/api/v1`
- Backend must be running on port 3000

---

## Notes

- Backend API running at: `http://localhost:3000/api/v1`
- All screens follow the same patterns shown above
- Use React Hook Form + Zod for all forms
- Use Zustand stores for state management
- The API client handles token refresh automatically

---

## Reference Documents

- [UI Component Guide](./UI_COMPONENT_GUIDE.md)
- [Design Reference](./DESIGN_REFERENCE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
