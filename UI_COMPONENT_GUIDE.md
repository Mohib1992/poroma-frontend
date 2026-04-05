# UI Component Guide

## পরমা (Poroma) - Frontend Component Library

This guide documents all UI components available for building the পরমা mobile application.

---

## Table of Contents

1. [Common Components](#common-components)
2. [Medication Components](#medication-components)
3. [Timeline Components](#timeline-components)
4. [Form Components](#form-components)

---

## Common Components

### Button

Primary action button component.

```typescript
import { Button } from '../components/common/Button';

// Usage
<Button
  title="Login"
  onPress={() => handleLogin()}
  variant="primary"  // "primary" | "secondary" | "outline" | "text"
  size="medium"      // "small" | "medium" | "large"
  disabled={false}
  loading={false}
/>
```

**Variants:**

| Variant | Use Case |
|---------|----------|
| primary | Main actions (Login, Submit, Add) |
| secondary | Secondary actions |
| outline | Alternative actions, borders only |
| text | Tertiary actions, no background |

**Sizes:**

| Size | Height | Font Size |
|------|--------|-----------|
| small | 36px | 14px |
| medium | 48px | 16px |
| large | 56px | 18px |

---

### Input

Text input field component.

```typescript
import { Input } from '../components/common/Input';

// Usage
<Input
  label="Phone Number"
  placeholder="+88017XXXXXXXX"
  value={phone}
  onChangeText={setPhone}
  error="Invalid phone number"
  keyboardType="phone-pad"
  secureTextEntry={false}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| label | string | Label text above input |
| placeholder | string | Placeholder text |
| value | string | Current value |
| onChangeText | function | Text change handler |
| error | string | Error message (shows red border) |
| keyboardType | KeyboardType | Keyboard type |
| secureTextEntry | boolean | Password field |

---

### Card

Container component with elevation and padding.

```typescript
import { Card } from '../components/common/Card';

// Usage
<Card>
  <Text>Card content here</Text>
</Card>

// With custom styles
<Card style={styles.customCard}>
  <Text>Custom card</Text>
</Card>
```

**Default Styles:**
- Background: #FFFFFF
- Border Radius: 16px
- Padding: 16px
- Elevation: 2 (shadow)

---

### Loading

Loading spinner indicator.

```typescript
import { Loading } from '../components/common/Loading';

// Usage
<Loading size="large" color="#2196F3" />

// Full screen overlay
<Loading overlay />
```

---

### EmptyState

Empty state placeholder with icon and action.

```typescript
import { EmptyState } from '../components/common/EmptyState';

// Usage
<EmptyState
  icon="💊"
  title="No medications yet"
  subtitle="Add your first medication to get started"
  actionLabel="Add Medication"
  onAction={() => navigation.navigate('AddMedication')}
/>
```

---

### ProgressBar

Progress indicator bar.

```typescript
import { ProgressBar } from '../components/common/ProgressBar';

// Usage
<ProgressBar
  progress={0.75}
  color="#4CAF50"
  backgroundColor="#E0E0E0"
  height={8}
/>
```

---

## Medication Components

### MedicationCard

Card displaying medication summary.

```typescript
import { MedicationCard } from '../components/medication/MedicationCard';

// Usage
<MedicationCard
  medication={medication}
  onPress={() => navigation.navigate('MedicationDetail', { id: medication.id })}
/>
```

**Display:**
- Medication name
- Dosage
- Frequency badge
- Next reminder time
- Active/Inactive status

---

### MedicationList

FlatList wrapper for medication cards.

```typescript
import { MedicationList } from '../components/medication/MedicationList';

// Usage
<MedicationList
  medications={medications}
  onPress={(medication) => handlePress(medication)}
  refreshing={isRefreshing}
  onRefresh={refresh}
/>
```

---

### MedicationForm

Complete medication input form.

```typescript
import { MedicationForm } from '../components/medication/MedicationForm';

// Usage
<MedicationForm
  initialValues={initialMedication}
  onSubmit={handleSubmit}
  onCancel={() => navigation.goBack()}
/>
```

**Fields:**
- Name (required)
- Dosage (required)
- Frequency (required)
- Times (required, at least one)
- Duration (optional)
- Notes (optional)
- Stock count (optional)

---

### TimeSlot

Time slot picker component.

```typescript
import { TimeSlot } from '../components/medication/TimeSlot';

// Usage
<TimeSlot
  label="Morning Dose"
  value="08:00"
  onChange={(time) => setMorningTime(time)}
/>
```

---

### FrequencySelector

Frequency selection grid.

```typescript
import { FrequencySelector } from '../components/medication/FrequencySelector';

// Usage
<FrequencySelector
  value={frequency}
  onChange={setFrequency}
/>
```

**Options:**
- Once Daily
- Twice Daily
- Three Times Daily
- Four Times Daily
- As Needed
- Weekly

---

### DosageInfo

Displays dosage information with timing.

```typescript
import { DosageInfo } from '../components/medication/DosageInfo';

// Usage
<DosageInfo
  dosage="1 tablet"
  times={["08:00", "20:00"]}
  notes="Take after food"
/>
```

---

## Timeline Components

### TimelineCard

Card showing medication in timeline.

```typescript
import { TimelineCard } from '../components/timeline/TimelineCard';

// Usage
<TimelineCard
  entry={timelineEntry}
  onMarkTaken={() => handleTaken(entry)}
  onSkip={() => handleSkip(entry)}
/>
```

**Display:**
- Time
- Medication name
- Dosage
- Status badge (pending/taken/skipped)
- Action buttons (if pending)

---

### TimelineSummary

Summary of daily progress.

```typescript
import { TimelineSummary } from '../components/timeline/TimelineSummary';

// Usage
<TimelineSummary
  total={4}
  taken={3}
  skipped={0}
  pending={1}
/>
```

**Display:**
- Progress circle
- Stats (Taken/Skipped/Pending)
- Adherence percentage

---

### FollowerItem

Display follower in timeline sharing.

```typescript
import { FollowerItem } from '../components/timeline/FollowerItem';

// Usage
<FollowerItem
  follower={follower}
  onNotifyToggle={(enabled) => handleNotify(enabled)}
  onRemove={() => handleRemove()}
/>
```

---

## Form Components

### FormInput

Enhanced input with label and validation.

```typescript
import { FormInput } from '../components/form/FormInput';

// Usage with React Hook Form
<FormInput
  name="phone"
  control={control}
  label="Phone Number"
  placeholder="+88017XXXXXXXX"
  keyboardType="phone-pad"
  rules={{
    required: 'Phone is required',
    pattern: {
      value: /^\+8801[3-9]\d{8}$/,
      message: 'Invalid Bangladesh phone number'
    }
  }}
/>
```

---

### FormSelect

Dropdown select component.

```typescript
import { FormSelect } from '../components/form/FormSelect';

// Usage
<FormSelect
  name="frequency"
  control={control}
  label="Frequency"
  options={frequencyOptions}
  rules={{ required: 'Frequency is required' }}
/>
```

---

### FormTimePicker

Time picker for medication schedules.

```typescript
import { FormTimePicker } from '../components/form/FormTimePicker';

// Usage
<FormTimePicker
  name="times"
  control={control}
  label="Reminder Times"
  addLabel="Add Another Time"
  onAddTime={addTime}
  onRemoveTime={removeTime}
/>
```

---

## Styling Guidelines

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #2196F3 | Buttons, links, highlights |
| Success | #4CAF50 | Success states, taken |
| Warning | #FF9800 | Warnings, refill alerts |
| Error | #F44336 | Errors, skipped |
| Background | #F5F5F5 | Screen backgrounds |
| Surface | #FFFFFF | Cards, inputs |
| Text Primary | #212121 | Main text |
| Text Secondary | #757575 | Secondary text |

### Typography

| Style | Size | Weight | Line Height |
|-------|------|--------|-------------|
| h1 | 32px | Bold (700) | 40px |
| h2 | 24px | Bold (700) | 32px |
| h3 | 20px | SemiBold (600) | 28px |
| body | 16px | Regular (400) | 24px |
| body2 | 14px | Regular (400) | 20px |
| caption | 12px | Regular (400) | 16px |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Icon gaps |
| md | 16px | Component padding |
| lg | 24px | Section spacing |
| xl | 32px | Screen margins |
| xxl | 48px | Large gaps |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 8px | Buttons, inputs |
| md | 12px | Cards |
| lg | 16px | Modals |
| full | 9999px | Pills, avatars |

---

## Creating New Components

### Component Template

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
  onPress?: () => void;
}

export const ComponentName: React.FC<Props> = ({
  title,
  variant = 'primary',
  onPress,
}) => {
  return (
    <View style={[styles.container, styles[variant]]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
  },
  primary: {
    backgroundColor: '#2196F3',
  },
  secondary: {
    backgroundColor: '#E0E0E0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ComponentName;
```

### Best Practices

1. **Type Safety** - Always define Props interface
2. **Default Props** - Provide sensible defaults
3. **Accessibility** - Include accessibilityLabel
4. **Testing** - Write unit tests for components
5. **Documentation** - Add JSDoc comments

---

## Component Library Index

| Component | File | Status |
|-----------|------|--------|
| Button | components/common/Button.tsx | ✅ Ready |
| Input | components/common/Input.tsx | ✅ Ready |
| Card | components/common/Card.tsx | ✅ Ready |
| Loading | components/common/Loading.tsx | ✅ Ready |
| EmptyState | components/common/EmptyState.tsx | ✅ Ready |
| ProgressBar | components/common/ProgressBar.tsx | ✅ Ready |
| MedicationCard | components/medication/MedicationCard.tsx | ✅ Ready |
| MedicationList | components/medication/MedicationList.tsx | ✅ Ready |
| TimelineCard | components/timeline/TimelineCard.tsx | ✅ Ready |
| TimelineSummary | components/timeline/TimelineSummary.tsx | ✅ Ready |
| FormInput | components/form/FormInput.tsx | ⏳ Pending |
| FormSelect | components/form/FormSelect.tsx | ⏳ Pending |
| FormTimePicker | components/form/FormTimePicker.tsx | ⏳ Pending |
