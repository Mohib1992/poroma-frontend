import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  white: '#ffffff',
};

export const MedicationsScreen: React.FC = () => {
  const navigation = useNavigation<MedicationsScreenNavigationProp>();
  const { medications, isLoading, refresh } = useMedications();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

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

  const filteredMedications = medications.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'Active') return matchesSearch && m.is_active;
    if (activeFilter === 'As Needed') return matchesSearch && m.frequency === 'as_needed';
    return matchesSearch;
  });

  const activeMedications = filteredMedications.filter((m) => m.is_active);
  const inactiveMedications = filteredMedications.filter((m) => !m.is_active);

  const filters = ['All', 'Active', 'As Needed'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerLabel}>CURATION</Text>
          <Text style={styles.headerTitle}>My Medications</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton}>
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={COLORS.onSurfaceVariant}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons
              name="magnify"
              size={22}
              color={COLORS.outline}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search medications..."
              placeholderTextColor={COLORS.outlineVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === filter && styles.filterButtonTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Medication List */}
        {filteredMedications.length > 0 ? (
          <View style={styles.medicationList}>
            {activeMedications.map((medication) => (
              <TouchableOpacity
                key={medication.id}
                style={styles.medicationCard}
                onPress={() => handleMedicationPress(medication)}
              >
                <View style={styles.medicationHeader}>
                  <View style={styles.medicationInfo}>
                    <View style={styles.medicationNameRow}>
                      <View
                        style={[
                          styles.statusDot,
                          medication.is_active
                            ? styles.statusDotActive
                            : styles.statusDotInactive,
                        ]}
                      />
                      <Text style={styles.medicationName}>{medication.name}</Text>
                    </View>
                    <Text style={styles.medicationDosage}>
                      {medication.dosage}
                    </Text>
                  </View>
                  <View style={styles.frequencyBadge}>
                    <Text style={styles.frequencyBadgeText}>
                      {medication.frequency === 'once_daily'
                        ? 'Daily'
                        : medication.frequency === 'as_needed'
                        ? 'As Needed'
                        : medication.frequency === 'twice_daily'
                        ? '2x Daily'
                        : medication.frequency === 'three_times'
                        ? '3x Daily'
                        : medication.frequency === 'four_times'
                        ? '4x Daily'
                        : medication.frequency}
                    </Text>
                  </View>
                </View>

                <View style={styles.medicationFooter}>
                  <View style={styles.nextDose}>
                    <Text style={styles.nextDoseLabel}>NEXT DOSE</Text>
                    <View style={styles.nextDoseRow}>
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={16}
                        color={COLORS.secondary}
                      />
                      <Text style={styles.nextDoseText}>
                        Today, 9:00 PM
                      </Text>
                    </View>
                  </View>
                  {medication.is_active && (
                    <TouchableOpacity style={styles.takeNowButton}>
                      <Text style={styles.takeNowButtonText}>Take Now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {inactiveMedications.length > 0 && (
              <View style={styles.inactiveSection}>
                <Text style={styles.inactiveSectionTitle}>
                  Inactive Medications ({inactiveMedications.length})
                </Text>
                {inactiveMedications.map((medication) => (
                  <TouchableOpacity
                    key={medication.id}
                    style={[styles.medicationCard, styles.inactiveCard]}
                    onPress={() => handleMedicationPress(medication)}
                  >
                    <View style={styles.medicationHeader}>
                      <View style={styles.medicationInfo}>
                        <View style={styles.medicationNameRow}>
                          <View style={[styles.statusDot, styles.statusDotInactive]} />
                          <Text style={styles.medicationName}>{medication.name}</Text>
                        </View>
                        <Text style={styles.medicationDosage}>
                          {medication.dosage}
                        </Text>
                      </View>
                      <View style={[styles.frequencyBadge, styles.frequencyBadgeInactive]}>
                        <Text style={styles.frequencyBadgeText}>
                          {medication.frequency === 'once_daily'
                            ? 'Daily'
                            : medication.frequency === 'as_needed'
                            ? 'As Needed'
                            : medication.frequency}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No medications found</Text>
            <Text style={styles.emptySubtitle}>
              Add your first medication to start tracking
            </Text>
          </View>
        )}

        {/* Curator's Note */}
        <View style={styles.curatorNote}>
          <View style={styles.curatorIcon}>
            <MaterialCommunityIcons
              name="leaf"
              size={32}
              color={COLORS.secondary}
            />
          </View>
          <View style={styles.curatorContent}>
            <Text style={styles.curatorTitle}>Curator's Note</Text>
            <Text style={styles.curatorText}>
              Maintaining consistency with your medication schedule has improved
              your cardiovascular wellness indicators by 12% this month. Keep
              up the serenity.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
        <MaterialCommunityIcons
          name="plus"
          size={32}
          color={COLORS.onPrimary}
        />
      </TouchableOpacity>
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
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: COLORS.surface,
  },
  headerContent: {},
  headerLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.secondary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: 'Manrope',
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  headerActions: {
    position: 'absolute',
    right: 32,
    top: 32,
    flexDirection: 'row',
    gap: 16,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainerHighset,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  searchSection: {
    paddingHorizontal: 32,
    marginBottom: 40,
  },
  searchContainer: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLORS.onSurface,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainerHigh,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: COLORS.secondary,
  },
  filterButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
  },
  filterButtonTextActive: {
    color: COLORS.onSecondary,
  },
  medicationList: {
    paddingHorizontal: 32,
    gap: 16,
  },
  medicationCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  inactiveCard: {
    opacity: 0.6,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  medicationInfo: {},
  medicationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotActive: {
    backgroundColor: COLORS.secondary,
  },
  statusDotInactive: {
    backgroundColor: COLORS.outlineVariant,
  },
  medicationName: {
    fontFamily: 'Manrope',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  medicationDosage: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
  },
  frequencyBadge: {
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  frequencyBadgeInactive: {
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  frequencyBadgeText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  medicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  nextDose: {},
  nextDoseLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.outline,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  nextDoseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextDoseText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  takeNowButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  takeNowButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.onPrimary,
  },
  inactiveSection: {
    marginTop: 24,
  },
  inactiveSectionTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    marginBottom: 16,
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Manrope',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
  curatorNote: {
    marginTop: 48,
    marginHorizontal: 32,
    marginBottom: 32,
    backgroundColor: COLORS.secondaryContainer,
    borderRadius: 24,
    padding: 32,
    flexDirection: 'row',
    gap: 24,
  },
  curatorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  curatorContent: {
    flex: 1,
  },
  curatorTitle: {
    fontFamily: 'Manrope',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  curatorText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.onSecondaryContainer,
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 112,
    right: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
});

export default MedicationsScreen;