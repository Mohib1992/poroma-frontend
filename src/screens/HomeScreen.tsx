import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTimeline } from '../hooks/useTimeline';
import { useAuth } from '../hooks/useAuth';
import { TimelineSummary } from '../components/timeline/TimelineSummary';
import { TimelineCard } from '../components/timeline/TimelineCard';
import { EmptyState } from '../components/common/EmptyState';
import { MainStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Home'
>;

const COLORS = {
  primary: '#002c28',
  primaryContainer: '#002c28',
  secondary: '#056a62',
  secondaryContainer: '#9eeee4',
  surface: '#f8faf8',
  surfaceContainerLow: '#f2f4f2',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#e6e9e7',
  onSurface: '#191c1b',
  onSurfaceVariant: '#414847',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#6e958f',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#106e66',
  primaryFixed: '#c1ebe4',
  outline: '#717977',
  outlineVariant: '#c0c8c6',
  background: '#f8faf8',
  error: '#ba1a1a',
  white: '#ffffff',
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const { timeline, isLoading, refresh, markMedication } = useTimeline();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getProgress = () => {
    if (!timeline || timeline.summary.total === 0) return 0;
    return Math.round((timeline.summary.taken / timeline.summary.total) * 100);
  };

  const handleMarkTaken = async (medicationId: string, scheduledTime: string) => {
    await markMedication(medicationId, scheduledTime, 'taken');
  };

  const handleSkip = async (medicationId: string, scheduledTime: string) => {
    await markMedication(medicationId, scheduledTime, 'skipped');
  };

  const pendingMedications =
    timeline?.medications.filter((m) => m.status === 'pending') || [];
  const takenMedications =
    timeline?.medications.filter((m) => m.status === 'taken') || [];
  const skippedMedications =
    timeline?.medications.filter((m) => m.status === 'skipped') || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Bar */}
        <View style={styles.topBar}>
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={COLORS.onSurfaceVariant}
              />
            </View>
            <Text style={styles.greetingText}>
              {getGreeting()}, {user?.name || 'Friend'}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color={COLORS.primaryContainer}
            />
          </TouchableOpacity>
        </View>

        {isLoading && !timeline ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : !timeline || timeline.summary.total === 0 ? (
          <EmptyState
            icon="pill"
            title="No medications today"
            subtitle="Add your first medication to start tracking your health journey"
            actionLabel="Add Medication"
            onAction={() => navigation.navigate('AddMedication')}
          />
        ) : (
          <View style={styles.mainContent}>
            {/* Today's Progress Card */}
            <View style={styles.progressCard}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Daily Adherence</Text>
                <Text style={styles.progressTitle}>
                  {timeline.summary.taken} of {timeline.summary.total} doses taken
                </Text>
                <Text style={styles.progressSubtitle}>
                  You're doing great. Almost there.
                </Text>
              </View>
              <View style={styles.progressCircle}>
                <View style={styles.progressCircleInner}>
                  <Text style={styles.progressPercentage}>{getProgress()}%</Text>
                </View>
              </View>
              <View style={styles.progressDecor} />
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={styles.addMedicationButton}
              onPress={() => navigation.navigate('AddMedication')}
            >
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={COLORS.onPrimary}
              />
              <Text style={styles.addMedicationText}>Add Medication</Text>
            </TouchableOpacity>

            {/* Upcoming Today Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Today</Text>
                <TouchableOpacity>
                  <Text style={styles.viewScheduleText}>View Schedule</Text>
                </TouchableOpacity>
              </View>

              {pendingMedications.length > 0 ? (
                pendingMedications.map((med) => (
                  <TimelineCard
                    key={`${med.medication_id}-${med.scheduled_time}`}
                    entry={med}
                    onMarkTaken={() => handleMarkTaken(med.medication_id, med.scheduled_time)}
                    onSkip={() => handleSkip(med.medication_id, med.scheduled_time)}
                  />
                ))
              ) : (
                <View style={styles.noUpcoming}>
                  <Text style={styles.noUpcomingText}>No upcoming medications</Text>
                </View>
              )}
            </View>

            {/* Insights Section */}
            <View style={styles.insightsGrid}>
              <View style={styles.insightCard}>
                <MaterialCommunityIcons
                  name="heart"
                  size={24}
                  color={COLORS.secondary}
                />
                <Text style={styles.insightLabel}>Health Score</Text>
                <Text style={styles.insightValue}>94/100</Text>
              </View>
              <View style={styles.insightCardLight}>
                <MaterialCommunityIcons
                  name="fire"
                  size={24}
                  color={COLORS.onSurfaceVariant}
                />
                <Text style={styles.insightLabel}>Streak</Text>
                <Text style={styles.insightValue}>12 Days</Text>
              </View>
            </View>
          </View>
        )}
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
    flexGrow: 1,
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  greetingText: {
    fontFamily: 'Manrope',
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primaryContainer,
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
  },
  mainContent: {
    paddingHorizontal: 24,
    gap: 24,
  },
  progressCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 28,
    padding: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  progressTitle: {
    fontFamily: 'Manrope',
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primaryContainer,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  progressSubtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onPrimaryContainer,
    marginTop: 8,
  },
  progressCircle: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  progressPercentage: {
    fontFamily: 'Manrope',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.secondary,
    position: 'absolute',
  },
  progressDecor: {
    position: 'absolute',
    right: -48,
    bottom: -48,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: COLORS.secondaryContainer,
    opacity: 0.1,
  },
  addMedicationButton: {
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  addMedicationText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.onPrimary,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Manrope',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primaryContainer,
  },
  viewScheduleText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  noUpcoming: {
    padding: 24,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    alignItems: 'center',
  },
  noUpcomingText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },
  insightsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  insightCard: {
    flex: 1,
    backgroundColor: COLORS.secondaryContainer,
    borderRadius: 16,
    padding: 24,
    gap: 12,
  },
  insightCardLight: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 24,
    gap: 12,
  },
  insightLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSecondaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  insightValue: {
    fontFamily: 'Manrope',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primaryContainer,
  },
});

export default HomeScreen;