import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TimelineEntry } from '../../types';
import { Card } from '../common/Card';

interface TimelineCardProps {
  entry: TimelineEntry;
  onMarkTaken?: () => void;
  onSkip?: () => void;
}

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
  white: '#FFFFFF',
};

export const TimelineCard: React.FC<TimelineCardProps> = ({
  entry,
  onMarkTaken,
  onSkip,
}) => {
  const getStatusStyle = () => {
    switch (entry.status) {
      case 'taken':
        return {
          container: styles.takenContainer,
          badge: styles.takenBadge,
          badgeText: styles.takenBadgeText,
        };
      case 'skipped':
        return {
          container: styles.skippedContainer,
          badge: styles.skippedBadge,
          badgeText: styles.skippedBadgeText,
        };
      default:
        return {
          container: styles.pendingContainer,
          badge: styles.pendingBadge,
          badgeText: styles.pendingBadgeText,
        };
    }
  };

  const getStatusLabel = () => {
    switch (entry.status) {
      case 'taken':
        return 'Taken';
      case 'skipped':
        return 'Skipped';
      default:
        return 'Pending';
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{entry.scheduled_time}</Text>
          <View style={[styles.statusBadge, statusStyle.badge]}>
            <Text style={[styles.statusText, statusStyle.badgeText]}>
              {getStatusLabel()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{entry.name}</Text>
        <Text style={styles.dosage}>{entry.dosage}</Text>
      </View>

      {entry.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.takeButton]}
            onPress={onMarkTaken}
          >
            <Text style={styles.takeButtonText}>Take</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton]}
            onPress={onSkip}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  takenContainer: {},
  skippedContainer: {},
  pendingContainer: {},
  takenBadge: {
    backgroundColor: COLORS.successLight,
  },
  skippedBadge: {
    backgroundColor: COLORS.errorLight,
  },
  pendingBadge: {
    backgroundColor: COLORS.warningLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  takenBadgeText: {
    color: COLORS.success,
  },
  skippedBadgeText: {
    color: COLORS.error,
  },
  pendingBadgeText: {
    color: COLORS.warning,
  },
  content: {
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  dosage: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  takeButton: {
    backgroundColor: COLORS.success,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  takeButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  skipButtonText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TimelineCard;
