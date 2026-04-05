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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
} from '../validators/medication.validator';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MainStackParamList } from '../navigation/types';

type AddMedicationScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'AddMedication'
>;

const COLORS = {
  primary: '#002c28',
  primaryContainer: '#00443e',
  secondary: '#056a62',
  secondaryContainer: '#9eeee4',
  surface: '#f8faf8',
  surfaceContainerLow: '#f2f4f2',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e7e8e7',
  surfaceContainerHighset: '#e1e3e1',
  onSurface: '#191c1b',
  onSurfaceVariant: '#404947',
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#106e66',
  primaryFixed: '#b4eee5',
  outline: '#707977',
  outlineVariant: '#bfc8c6',
  background: '#f8faf8',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  white: '#ffffff',
};

export const AddMedicationScreen: React.FC = () => {
  const navigation = useNavigation<AddMedicationScreenNavigationProp>();
  const { addMedication } = useMedications();
  const [isLoading, setIsLoading] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [withFoodEnabled, setWithFoodEnabled] = useState(false);

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

  const frequencyLabels: Record<string, string> = {
    once_daily: 'Every Day',
    twice_daily: 'Twice Daily',
    three_times: 'Three Times',
    four_times: 'Four Times',
    as_needed: 'As Needed',
    weekly: 'Weekly',
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
          {/* Top App Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.topBarButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Add Medication</Text>
            <TouchableOpacity
              style={styles.topBarButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Medication Info Card */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>MEDICATION NAME</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWithIcon}>
                    <MaterialCommunityIcons
                      name="pill"
                      size={22}
                      color={COLORS.secondary}
                      style={styles.inputIcon}
                    />
                    <Input
                      placeholder="Enter name..."
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.name?.message}
                      containerStyle={styles.noMarginInput}
                    />
                  </View>
                )}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>DOSAGE</Text>
                <Controller
                  control={control}
                  name="dosage"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="50mg"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.dosage?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>

          {/* Schedule Card */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Schedule</Text>
              <MaterialCommunityIcons
                name="calendar-today"
                size={22}
                color={COLORS.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FREQUENCY</Text>
              <Controller
                control={control}
                name="frequency"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.frequencyButtons}>
                    {frequencyOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.frequencyButton,
                          value === option.value && styles.frequencyButtonActive,
                        ]}
                        onPress={() => handleFrequencyChange(option.value)}
                      >
                        <Text
                          style={[
                            styles.frequencyButtonText,
                            value === option.value &&
                              styles.frequencyButtonTextActive,
                          ]}
                        >
                          {frequencyLabels[option.value] || option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>

            {times.length > 0 && frequency !== 'as_needed' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>TIME SLOTS</Text>
                {times.map((time, index) => (
                  <View key={index} style={styles.timeSlotRow}>
                    <Controller
                      control={control}
                      name={`times.${index}`}
                      render={({ field: { onChange } }) => (
                        <Input
                          placeholder="08:00 AM"
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
                        style={styles.deleteButton}
                        onPress={() => removeTime(index)}
                      >
                        <MaterialCommunityIcons
                          name="delete"
                          size={22}
                          color={COLORS.error}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {(frequency as string) !== 'weekly' && (frequency as string) !== 'as_needed' && (
                  <TouchableOpacity
                    style={styles.addTimeButton}
                    onPress={addTime}
                  >
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={20}
                      color={COLORS.secondary}
                    />
                    <Text style={styles.addTimeText}>Add Time Slot</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Reminder Settings */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Reminders</Text>
                <Text style={styles.sectionSubtitle}>Smart Notifications</Text>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
                trackColor={{ false: COLORS.surfaceContainerHigh, true: COLORS.secondary }}
                thumbColor={COLORS.white}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>STOCK COUNT</Text>
              <Controller
                control={control}
                name="stock_count"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Number of pills remaining"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="number-pad"
                    error={errors.stock_count?.message}
                  />
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>REFILL ALERT</Text>
              <Controller
                control={control}
                name="refill_alert_days"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="7 days before"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="number-pad"
                    error={errors.refill_alert_days?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Additional Info */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NOTES</Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Additional instructions..."
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={3}
                    error={errors.notes?.message}
                  />
                )}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <View style={styles.toggleIcon}>
                  <MaterialCommunityIcons
                    name="food"
                    size={22}
                    color={COLORS.onSecondaryContainer}
                  />
                </View>
                <View>
                  <Text style={styles.toggleLabel}>With Food</Text>
                  <Text style={styles.toggleSubtitle}>
                    Take during or after meal
                  </Text>
                </View>
              </View>
              <Switch
                value={withFoodEnabled}
                onValueChange={setWithFoodEnabled}
                trackColor={{ false: COLORS.surfaceContainerHigh, true: COLORS.secondary }}
                thumbColor={COLORS.white}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Medication'}
            </Text>
          </TouchableOpacity>
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
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerLow,
  },
  topBarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontFamily: 'Manrope',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  formCard: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Manrope',
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.onSurface,
    opacity: 0.6,
    letterSpacing: 1,
    marginBottom: 12,
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 38,
    zIndex: 1,
  },
  noMarginInput: {
    marginBottom: 0,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Manrope',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  sectionSubtitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: COLORS.outline,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  frequencyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  frequencyButtonActive: {
    backgroundColor: COLORS.secondary,
  },
  frequencyButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
  },
  frequencyButtonTextActive: {
    color: COLORS.onSecondary,
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  timeInput: {
    flex: 1,
    marginBottom: 0,
  },
  deleteButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.outlineVariant,
    borderRadius: 12,
  },
  addTimeText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleLabel: {
    fontFamily: 'Manrope',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  toggleSubtitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: COLORS.outline,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainerLow,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  saveButtonText: {
    fontFamily: 'Manrope',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onPrimary,
  },
});

export default AddMedicationScreen;