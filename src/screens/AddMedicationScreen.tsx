import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedications } from '../hooks/useMedications';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import {
  medicationSchema,
  MedicationFormData,
  frequencyOptions,
  timeRegex,
} from '../validators/medication.validator';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MainStackParamList } from '../navigation/types';

type AddMedicationScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'AddMedication'
>;

const COLORS = {
  primary: '#2196F3',
  primaryLight: '#BBDEFB',
  black: '#212121',
  gray: '#757575',
  lightGray: '#BDBDBD',
  background: '#F5F5F5',
  white: '#FFFFFF',
  success: '#4CAF50',
  error: '#F44336',
};

export const AddMedicationScreen: React.FC = () => {
  const navigation = useNavigation<AddMedicationScreenNavigationProp>();
  const { addMedication } = useMedications();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: '',
      dosage: '',
      frequency: 'once_daily',
      times: ['08:00'],
      notes: '',
      stock_count: '',
      refill_alert_days: '7',
    },
  });

  const frequency = watch('frequency');
  const times = watch('times');

  const handleFrequencyChange = (value: string) => {
    setValue('frequency', value as MedicationFormData['frequency']);

    const defaultTimes: Record<string, string[]> = {
      once_daily: ['08:00'],
      twice_daily: ['08:00', '20:00'],
      three_times: ['08:00', '14:00', '20:00'],
      four_times: ['08:00', '12:00', '16:00', '20:00'],
      as_needed: [],
      weekly: ['08:00'],
    };

    if (defaultTimes[value]) {
      setValue('times', defaultTimes[value]);
    }
  };

  const addTime = () => {
    setValue('times', [...times, '12:00']);
  };

  const removeTime = (index: number) => {
    if (times.length > 1) {
      const newTimes = times.filter((_, i) => i !== index);
      setValue('times', newTimes);
    }
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setValue('times', newTimes);
  };

  const onSubmit = async (data: MedicationFormData) => {
    setIsLoading(true);
    try {
      await addMedication({
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        times: data.times,
        start_date: new Date().toISOString(),
        notes: data.notes,
        stock_count: data.stock_count ? parseInt(data.stock_count, 10) : undefined,
        refill_alert_days: data.refill_alert_days
          ? parseInt(data.refill_alert_days, 10)
          : undefined,
      });
      Alert.alert('Success', 'Medication added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to add medication';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.formCard}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Medication Name *"
                  placeholder="e.g., Metformin 500mg"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="dosage"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Dosage *"
                  placeholder="e.g., 1 tablet"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.dosage?.message}
                />
              )}
            />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Frequency *</Text>
              <View style={styles.frequencyGrid}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.frequencyOption,
                      frequency === option.value &&
                        styles.frequencyOptionActive,
                    ]}
                    onPress={() => handleFrequencyChange(option.value)}
                  >
                    <Text
                      style={[
                        styles.frequencyOptionText,
                        frequency === option.value &&
                          styles.frequencyOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.frequency && (
                <Text style={styles.errorText}>
                  {errors.frequency.message}
                </Text>
              )}
            </View>

            {frequency !== 'as_needed' && times.length > 0 && (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Reminder Times *</Text>
                {times.map((time, index) => (
                  <View key={index} style={styles.timeRow}>
                    <Controller
                      control={control}
                      name={`times.${index}`}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          placeholder="HH:MM"
                          value={time}
                          onChangeText={(text) => {
                            updateTime(index, text);
                            onChange(text);
                          }}
                          containerStyle={styles.timeInput}
                        />
                      )}
                    />
                    {times.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeTimeButton}
                        onPress={() => removeTime(index)}
                      >
                        <Text style={styles.removeTimeText}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {frequency !== 'weekly' && frequency !== 'as_needed' && (
                  <TouchableOpacity
                    style={styles.addTimeButton}
                    onPress={addTime}
                  >
                    <Text style={styles.addTimeText}>+ Add Another Time</Text>
                  </TouchableOpacity>
                )}
                {errors.times && typeof errors.times.message === 'string' && (
                  <Text style={styles.errorText}>{errors.times.message}</Text>
                )}
              </View>
            )}

            <Controller
              control={control}
              name="stock_count"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Stock Count (optional)"
                  placeholder="Number of pills remaining"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  error={errors.stock_count?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="refill_alert_days"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Refill Alert Days (optional)"
                  placeholder="Alert when stock is low"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  error={errors.refill_alert_days?.message}
                  hint="Days before running out to remind you"
                />
              )}
            />

            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Notes (optional)"
                  placeholder="Any special instructions"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={3}
                  error={errors.notes?.message}
                />
              )}
            />
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Add Medication"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            size="large"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  formCard: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  frequencyOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  frequencyOptionText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  frequencyOptionTextActive: {
    color: COLORS.white,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeInput: {
    flex: 1,
    marginBottom: 0,
  },
  removeTimeButton: {
    paddingVertical: 14,
  },
  removeTimeText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '500',
  },
  addTimeButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addTimeText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default AddMedicationScreen;
