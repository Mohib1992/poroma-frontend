import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedications } from '../hooks/useMedications';
import { MedicationList } from '../components/medication/MedicationList';
import { Medication } from '../types';
import { MainStackParamList } from '../navigation/types';

type MedicationsScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Medications'
>;

const COLORS = {
  primary: '#2196F3',
  black: '#212121',
  gray: '#757575',
  background: '#F5F5F5',
  white: '#FFFFFF',
};

export const MedicationsScreen: React.FC = () => {
  const navigation = useNavigation<MedicationsScreenNavigationProp>();
  const { medications, isLoading, refresh } = useMedications();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleMedicationPress = (medication: Medication) => {
    navigation.navigate('MedicationDetail', { id: medication.id });
  };

  const handleAddPress = () => {
    navigation.navigate('AddMedication');
  };

  const activeMedications = medications.filter((m) => m.is_active);
  const inactiveMedications = medications.filter((m) => !m.is_active);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Medications</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPress}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <MedicationList
        medications={activeMedications}
        onPress={handleMedicationPress}
        refreshing={refreshing || isLoading}
        onRefresh={onRefresh}
        onAddPress={handleAddPress}
        emptyTitle="No medications yet"
        emptySubtitle="Add your first medication to start tracking"
      />

      {inactiveMedications.length > 0 && (
        <View style={styles.inactiveSection}>
          <Text style={styles.inactiveSectionTitle}>
            Inactive Medications ({inactiveMedications.length})
          </Text>
          <MedicationList
            medications={inactiveMedications}
            onPress={handleMedicationPress}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  inactiveSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 16,
    paddingTop: 16,
  },
  inactiveSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
});

export default MedicationsScreen;
