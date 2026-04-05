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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedications } from '../hooks/useMedications';
import { Card } from '../components/common/Card';
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
  primary: '#2196F3',
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  errorLight: '#FFEBEE',
  black: '#212121',
  gray: '#757575',
  lightGray: '#BDBDBD',
  background: '#F5F5F5',
  white: '#FFFFFF',
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
        <Card style={styles.mainCard}>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dosage</Text>
            <Text style={styles.sectionValue}>{medication.dosage}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequency</Text>
            <Text style={styles.sectionValue}>
              {frequencyLabels[medication.frequency] || medication.frequency}
            </Text>
          </View>

          {medication.times.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reminder Times</Text>
              <View style={styles.timesContainer}>
                {medication.times.map((time, index) => (
                  <View key={index} style={styles.timeBadge}>
                    <Text style={styles.timeText}>{time}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Start Date</Text>
            <Text style={styles.sectionValue}>
              {formatDate(medication.start_date)}
            </Text>
          </View>

          {medication.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.notesText}>{medication.notes}</Text>
            </View>
          )}
        </Card>

        {medication.stock_count !== undefined && (
          <Card style={styles.stockCard}>
            <View style={styles.stockHeader}>
              <View>
                <Text style={styles.sectionTitle}>Current Stock</Text>
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

            <View style={styles.stockActions}>
              <TouchableOpacity
                style={styles.updateStockButton}
                onPress={() => {
                  setStockInput(medication.stock_count?.toString() || '0');
                  setStockModalVisible(true);
                }}
              >
                <Text style={styles.updateStockText}>Update Stock</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {stockModalVisible && (
          <Card style={styles.stockModal}>
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
                variant="outline"
                onPress={() => {
                  setStockModalVisible(false);
                  setStockInput('');
                }}
                style={styles.modalButton}
              />
              <Button
                title="Save"
                onPress={handleUpdateStock}
                loading={isLoading}
                style={styles.modalButton}
              />
            </View>
          </Card>
        )}

        <View style={styles.actionsSection}>
          <Button
            title={medication.is_active ? 'Deactivate' : 'Activate'}
            variant={medication.is_active ? 'outline' : 'primary'}
            onPress={handleToggleActive}
            fullWidth
            style={styles.actionButton}
          />

          <Button
            title="Delete Medication"
            variant="text"
            onPress={handleDelete}
            fullWidth
            textStyle={styles.deleteButtonText}
          />
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
    padding: 16,
    paddingBottom: 40,
  },
  mainCard: {
    padding: 20,
    marginBottom: 16,
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
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
  },
  nameBn: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: COLORS.successLight,
  },
  inactiveBadge: {
    backgroundColor: '#F0F0F0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusText: {
    color: COLORS.success,
  },
  inactiveStatusText: {
    color: COLORS.gray,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 16,
    color: COLORS.black,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  notesText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  stockCard: {
    padding: 20,
    marginBottom: 16,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stockValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 4,
  },
  lowStockText: {
    color: COLORS.error,
  },
  refillBadge: {
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  refillBadgeText: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '600',
  },
  stockActions: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  updateStockButton: {
    alignSelf: 'flex-start',
  },
  updateStockText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  stockModal: {
    padding: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  stockInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stockAdjustButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockAdjustText: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: '600',
  },
  stockInput: {
    width: 80,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  stockInputText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.black,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  actionsSection: {
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 12,
  },
  deleteButtonText: {
    color: COLORS.error,
  },
});

export default MedicationDetailScreen;
