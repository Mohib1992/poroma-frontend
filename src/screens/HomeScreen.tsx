import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  primary: '#2196F3',
  primaryDark: '#1976D2',
  black: '#212121',
  gray: '#757575',
  lightGray: '#BDBDBD',
  background: '#F5F5F5',
  white: '#FFFFFF',
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
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
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
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name || 'Friend'}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddMedication')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {isLoading && !timeline ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : !timeline || timeline.summary.total === 0 ? (
          <EmptyState
            icon="💊"
            title="No medications today"
            subtitle="Add your first medication to start tracking your health journey"
            actionLabel="Add Medication"
            onAction={() => navigation.navigate('AddMedication')}
          />
        ) : (
          <>
            <TimelineSummary
              total={timeline.summary.total}
              taken={timeline.summary.taken}
              skipped={timeline.summary.skipped}
              pending={timeline.summary.pending}
            />

            {pendingMedications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming</Text>
                {pendingMedications.map((med) => (
                  <TimelineCard
                    key={`${med.medication_id}-${med.scheduled_time}`}
                    entry={med}
                    onMarkTaken={() => handleMarkTaken(med.medication_id, med.scheduled_time)}
                    onSkip={() => handleSkip(med.medication_id, med.scheduled_time)}
                  />
                ))}
              </View>
            )}

            {takenMedications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Taken</Text>
                {takenMedications.map((med) => (
                  <TimelineCard
                    key={`${med.medication_id}-${med.scheduled_time}`}
                    entry={med}
                  />
                ))}
              </View>
            )}

            {skippedMedications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skipped</Text>
                {skippedMedications.map((med) => (
                  <TimelineCard
                    key={`${med.medication_id}-${med.scheduled_time}`}
                    entry={med}
                  />
                ))}
              </View>
            )}
          </>
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
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 28,
    color: COLORS.white,
    fontWeight: '300',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
});

export default HomeScreen;
