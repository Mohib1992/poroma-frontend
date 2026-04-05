# Contributing Guidelines

## পরমা (Poroma) - Frontend Development

Thank you for contributing to পরমা! Please follow these guidelines for consistent and efficient development.

---

## Code Style

### TypeScript Guidelines

1. **Use strict TypeScript**
   - Enable strict mode
   - Avoid `any` - use `unknown` when type is unclear
   - Define proper interfaces and types

2. **Naming Conventions**
   ```typescript
   // Interfaces - PascalCase with 'I' prefix (optional, team preference)
   interface IUser { ... }
   interface UserProps { ... }
   
   // Types - PascalCase
   type AuthState = 'loading' | 'authenticated' | 'guest';
   
   // Components - PascalCase
   const HomeScreen: React.FC = () => { ... }
   
   // Hooks - camelCase with 'use' prefix
   const useAuth = () => { ... }
   const useMedications = () => { ... }
   
   // Files - kebab-case
   // login-screen.tsx, medication-card.tsx
   ```

3. **File Structure**
   ```
   src/
   ├── api/              # API client and endpoints
   ├── components/       # Reusable components
   │   ├── common/      # Generic components
   │   ├── medication/  # Medication-specific
   │   └── timeline/    # Timeline-specific
   ├── screens/         # Screen components
   ├── navigation/      # Navigation config
   ├── stores/          # Zustand stores
   ├── hooks/           # Custom hooks
   ├── utils/           # Utility functions
   ├── types/           # TypeScript types
   └── App.tsx          # App entry
   ```

---

## React Native Best Practices

### Component Structure

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

interface Props {
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

export const ComponentName: React.FC<Props> = ({
  title,
  subtitle,
  onPress,
}) => {
  // Hooks first
  const { user } = useAuth();
  
  // Then render
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
  },
});

export default ComponentName;
```

### Screen Structure

```typescript
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';

export const ScreenName: React.FC<Props> = ({ navigation, route }) => {
  // 1. State
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 2. Effects
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Callbacks
  const fetchData = useCallback(async () => {
    try {
      // fetch logic
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  // 4. Render helpers
  const renderItem = ({ item }) => <ItemCard item={item} />;

  // 5. Main render
  if (isLoading) return <LoadingSpinner />;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};
```

---

## Git Workflow

### Branch Naming

```
feature/screen-name        # New screens
feature/component-name    # New components
feature/feature-name      # Feature additions
bugfix/bug-description     # Bug fixes
fix/issue-description      # Quick fixes
refactor/refactor-name    # Refactoring
docs/documentation        # Docs updates
```

### Commit Messages

Follow conventional commits:

```
feat: add home screen with timeline
feat: add medication card component
fix: resolve login validation error
fix: handle empty medication list
refactor: update medication store structure
docs: add component documentation
style: adjust card padding
test: add home screen tests
```

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes
3. Write/update tests
4. Update documentation
5. Submit PR with description
6. Address review comments
7. Squash and merge

---

## State Management (Zustand)

### Store Structure

```typescript
import { create } from 'zustand';
import { Medication } from '../types';

interface MedicationState {
  medications: Medication[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchMedications: () => Promise<void>;
  addMedication: (data: MedicationInput) => Promise<Medication>;
  deleteMedication: (id: string) => Promise<void>;
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
  medications: [],
  isLoading: false,
  error: null,

  fetchMedications: async () => {
    set({ isLoading: true, error: null });
    try {
      const medications = await medicationApi.getMedications();
      set({ medications });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addMedication: async (data) => {
    const result = await medicationApi.addMedication(data);
    set((state) => ({ medications: [result, ...state.medications] }));
    return result;
  },

  deleteMedication: async (id) => {
    await medicationApi.deleteMedication(id);
    set((state) => ({
      medications: state.medications.filter((m) => m.id !== id),
    }));
  },
}));
```

### Store Usage

```typescript
// In components
const { medications, isLoading, fetchMedications } = useMedicationStore();
```

---

## Navigation

### Stack Navigator

```typescript
// navigation/types.ts
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  AddMedication: undefined;
  MedicationDetail: { id: string };
  Settings: undefined;
};

// Usage
navigation.navigate('MedicationDetail', { id: medication.id });

// Type checking
const route = useRoute<RouteProp<RootStackParamList, 'MedicationDetail'>>();
const { id } = route.params;
```

### Tab Navigator

```typescript
// Bottom tabs
const Tab = createBottomTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Medications" component={MedicationsScreen} />
  <Tab.Screen name="Settings" component={SettingsScreen} />
</Tab.Navigator>
```

---

## Forms (React Hook Form + Zod)

### Validation Schema

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid phone number'),
  password: z.string().min(1, 'Password is required'),
});

export const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  times: z.array(z.string()).min(1, 'At least one time is required'),
  duration: z.string().optional(),
  notes: z.string().optional(),
});
```

### Form Component

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../validators/auth.validator';

export const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const onSubmit = (data) => console.log(data);

  return (
    <View>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Phone"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.phone && <Text>{errors.phone.message}</Text>}
      
      <Button onPress={handleSubmit(onSubmit)} />
    </View>
  );
};
```

---

## API Integration

### API Client Pattern

```typescript
// api/client.ts
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
    });

    this.client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async get<T>(url: string, params?: object): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data.data;
  }

  async post<T>(url: string, data?: object): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data;
  }
}

export const apiClient = new ApiClient();
```

### API Endpoint Pattern

```typescript
// api/medication.api.ts
export const medicationApi = {
  getMedications: () => apiClient.get<{ medications: Medication[] }>('/medications'),
  addMedication: (data: MedicationInput) => apiClient.post<{ medication: Medication }>('/medications', data),
  deleteMedication: (id: string) => apiClient.delete(`/medications/${id}`),
};
```

---

## Styling

### Style Guidelines

1. **Use StyleSheet.create()** - Performance optimization
2. **Collocated styles** - Keep styles near component
3. **Reuse common styles** - Shared styles module
4. **Responsive** - Consider different screen sizes

### Style Organization

```typescript
// styles/common.ts
export const colors = {
  primary: '#2196F3',
  success: '#4CAF50',
  error: '#F44336',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
});
```

---

## Testing

### Test Structure

```
__tests__/
├── unit/
│   ├── components/
│   └── hooks/
├── integration/
│   └── screens/
└── setup.ts
```

### Component Test

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../components/common/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Test" onPress={() => {}} />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Test" onPress={onPress} />);
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

---

## Performance

### Optimization Tips

1. **Use FlatList** for long lists
2. **Memoize components** with `React.memo`
3. **Use callbacks** for event handlers
4. **Lazy load screens** with lazy()
5. **Optimize images** - Use appropriate sizes
6. **Avoid anonymous functions** in render

### Good Practices

```typescript
// Good - memoize
const MedicationCard = React.memo(({ medication, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{medication.name}</Text>
    </TouchableOpacity>
  );
});

// Good - useCallback
const handlePress = useCallback(() => {
  onMedicationPress(medication.id);
}, [onMedicationPress, medication.id]);

// Good - FlatList optimization
<FlatList
  data={medications}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

---

## Accessibility

### Requirements

1. **All images** have alt text
2. **Touch targets** minimum 44x44px
3. **Color contrast** meets WCAG 2.1 AA
4. **Screen reader** labels on interactive elements
5. **Focus management** for modals

### Implementation

```typescript
<TouchableOpacity
  accessibilityLabel="Add medication"
  accessibilityHint="Opens add medication form"
  accessibilityRole="button"
  onPress={handleAdd}
>
  <Text>Add</Text>
</TouchableOpacity>
```

---

## Documentation

### Code Documentation

```typescript
/**
 * Fetches and displays the daily medication timeline.
 * 
 * @param date - Optional date string (YYYY-MM-DD). Defaults to today.
 * @returns Timeline with medications and their statuses.
 */
export const useTimeline = (date?: string) => {
  // ...
};
```

### README Updates

Update README when:
- Adding new dependencies
- Changing build process
- Adding new environment variables
- Updating project structure

---

## Questions?

For questions or clarifications, refer to:
- [UI Component Guide](./UI_COMPONENT_GUIDE.md)
- [Design Reference](./DESIGN_REFERENCE.md)
- [System Architecture](../SYSTEM_ARCHITECTURE.md)

---

## License

Proprietary - All rights reserved
