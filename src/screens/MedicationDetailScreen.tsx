import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedications } from '../hooks/useMedications';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { MainStackParamList } from '../navigation/types';

type MedicationDetailScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'MedicationDetail'
>;

type MedicationDetailScreenRouteProp = RouteProp<
  MainStackParamList,
  'MedicationDetail'
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
  onSurface: '#191c1b',
  onSurfaceVariant: '#404947',
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#106e66',
  primaryFixed: '#b4eee5',
  outline: '#707977',
  outlineVariant: '#c0c8c6',
  background: '#f8faf8',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  warning: '#ff9800',
  warningLight: '#fff3e0',
  success: '#4caf50',
  successLight: '#e8f5e9',
  white: '#ffffff',
};

const frequencyLabels: Record<string, string> = {
  once_daily: 'Once Daily',
  twice_daily: 'Twice Daily',
  three_times: 'Three Times',
  four_times: 'Four Times',
  as_needed: 'As Needed',
  weekly: 'Weekly',
};

export const MedicationDetailScreen: React.FC = () => {
  const navigation = useNavigation<MedicationDetailScreenNavigationProp>();
  const route = useRoute<MedicationDetailScreenRouteProp>();
  const { id } = route.params;

  const {
    getMedicationById,
    deleteMedication,
    toggleActive,
    updateStock,
    isLoading,
  } = useMedications();

  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [stockInput, setStockInput] = useState('');

  const medication = getMedicationById(id);

  useEffect(() => {
    if (!medication) {
      Alert.alert('Error', 'Medication not found', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [medication, navigation]);

  if (!medication) {
    return <Loading size="large" color={COLORS.primary} />;
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedication(id);
              navigation.goBack();
            } catch (error: unknown) {
              const message =
                error instanceof Error
                  ? error.message
                  : 'Failed to delete medication';
              Alert.alert('Error', message);
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async () => {
    try {
      await toggleActive(id, !medication.is_active);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update medication';
      Alert.alert('Error', message);
    }
  };

  const handleUpdateStock = async () => {
    const stock = parseInt(stockInput, 10);
    if (isNaN(stock) || stock < 0) {
      Alert.alert('Error', 'Please enter a valid stock count');
      return;
    }
    try {
      await updateStock(id, stock);
      setStockModalVisible(false);
      setStockInput('');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update stock';
      Alert.alert('Error', message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Medication Details</Text>
          <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons
              name="pencil"
              size={22}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Main Info Card */}
        <View style={styles.mainCard}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.name}>{medication.name}</Text>
              {medication.name_bn && (
                <Text style={styles.nameBn}>{medication.name_bn}</Text>
              )}
            </View>
            <View
              style={[
                styles.statusBadge,
                medication.is_active
                  ? styles.activeBadge
                  : styles.inactiveBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  medication.is_active
                    ? styles.activeStatusText
                    : styles.inactiveStatusText,
                ]}
              >
                {medication.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          <View style={styles.dosageCard}>
            <MaterialCommunityIcons
              name="pill"
              size={32}
              color={COLORS.secondary}
            />
            <Text style={styles.dosageText}>{medication.dosage}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>FREQUENCY</Text>
            <Text style={styles.detailValue}>
              {frequencyLabels[medication.frequency] || medication.frequency}
            </Text>
          </View>

          {medication.times.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>REMINDER TIMES</Text>
              <View style={styles.timesContainer}>
                {medication.times.map((time, index) => (
                  <View key={index} style={styles.timeBadge}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={14}
                      color={COLORS.secondary}
                    />
                    <Text style={styles.timeText}>{time}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>START DATE</Text>
            <Text style={styles.detailValue}>
              {formatDate(medication.start_date)}
            </Text>
          </View>

          {medication.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.detailLabel}>NOTES</Text>
              <Text style={styles.notesText}>{medication.notes}</Text>
            </View>
          )}
        </View>

        {/* Stock Card */}
        {medication.stock_count !== undefined && (
          <View style={styles.stockCard}>
            <View style={styles.stockHeader}>
              <View style={styles.stockInfo}>
                <Text style={styles.stockLabel}>CURRENT STOCK</Text>
                <Text
                  style={[
                    styles.stockValue,
                    medication.stock_count <= 5 && styles.lowStockText,
                  ]}
                >
                  {medication.stock_count} pills remaining
                </Text>
              </View>
              {medication.stock_count <= 5 && (
                <View style={styles.refillBadge}>
                  <Text style={styles.refillBadgeText}>Low Stock</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.updateStockButton}
              onPress={() => {
                setStockInput(medication.stock_count?.toString() || '0');
                setStockModalVisible(true);
              }}
            >
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={COLORS.secondary}
              />
              <Text style={styles.updateStockText}>Update Stock</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stock Modal */}
        {stockModalVisible && (
          <View style={styles.stockModal}>
            <Text style={styles.modalTitle}>Update Stock</Text>
            <View style={styles.stockInputContainer}>
              <TouchableOpacity
                style={styles.stockAdjustButton}
                onPress={() => {
                  const current = parseInt(stockInput, 10) || 0;
                  setStockInput(Math.max(0, current - 1).toString());
                }}
              >
                <Text style={styles.stockAdjustText}>-</Text>
              </TouchableOpacity>
              <View style={styles.stockInput}>
                <Text style={styles.stockInputText}>{stockInput}</Text>
              </View>
              <TouchableOpacity
                style={styles.stockAdjustButton}
                onPress={() => {
                  const current = parseInt(stockInput, 10) || 0;
                  setStockInput((current + 1).toString());
                }}
              >
                <Text style={styles.stockAdjustText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => {
                  setStockModalVisible(false);
                  setStockInput('');
                }}
                style={styles.cancelButton}
              />
              <Button
                title="Save"
                onPress={handleUpdateStock}
                loading={isLoading}
                style={styles.saveButton}
              />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              medication.is_active
                ? styles.deactivateButton
                : styles.activateButton,
            ]}
            onPress={handleToggleActive}
          >
            <MaterialCommunityIcons
              name={medication.is_active ? 'pause-circle' : 'play-circle'}
              size={22}
              color={
                medication.is_active
                  ? COLORS.onSurfaceVariant
                  : COLORS.onPrimary
              }
            />
            <Text
              style={[
                styles.actionButtonText,
                medication.is_active
                  ? styles.deactivateButtonText
                  : styles.activateButtonText,
              ]}
            >
              {medication.is_active ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={22}
              color={COLORS.error}
            />
            <Text style={styles.deleteButtonText}>Delete Medication</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontFamily: 'Manrope',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    margin: 24,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 28,
    padding: 24,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Manrope',
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  nameBn: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeBadge: {
    backgroundColor: COLORS.successLight,
  },
  inactiveBadge: {
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  statusText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  activeStatusText: {
    color: COLORS.success,
  },
  inactiveStatusText: {
    color: COLORS.onSurfaceVariant,
  },
  dosageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryContainer,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  dosageText: {
    fontFamily: 'Manrope',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    marginBottom: 20,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 8,
  },
  detailValue: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.onSurface,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  timeText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.secondary,
  },
  notesSection: {
    marginTop: 8,
  },
  notesText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 22,
    marginTop: 4,
  },
  stockCard: {
    marginHorizontal: 24,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 24,
    padding: 20,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stockInfo: {},
  stockLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1,
  },
  stockValue: {
    fontFamily: 'Manrope',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginTop: 4,
  },
  lowStockText: {
    color: COLORS.error,
  },
  refillBadge: {
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  refillBadgeText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warning,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  updateStockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainerLow,
  },
  updateStockText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  stockModal: {
    marginHorizontal: 24,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  modalTitle: {
    fontFamily: 'Manrope',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onSurface,
    textAlign: 'center',
    marginBottom: 24,
  },
  stockInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  stockAdjustButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockAdjustText: {
    fontFamily: 'Manrope',
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  stockInput: {
    width: 100,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  stockInputText: {
    fontFamily: 'Manrope',
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  actionsSection: {
    marginHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 28,
  },
  activateButton: {
    backgroundColor: COLORS.primary,
  },
  deactivateButton: {
    backgroundColor: COLORS.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  actionButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
  },
  activateButtonText: {
    color: COLORS.onPrimary,
  },
  deactivateButtonText: {
    color: COLORS.onSurfaceVariant,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: COLORS.errorContainer,
  },
  deleteButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
  },
});

export default MedicationDetailScreen;