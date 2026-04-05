import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

interface TimelineSummaryProps {
  total: number;
  taken: number;
  skipped: number;
  pending: number;
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
};

export const TimelineSummary: React.FC<TimelineSummaryProps> = ({
  total,
  taken,
  skipped,
  pending,
}) => {
  const adherenceRate = total > 0 ? Math.round((taken / total) * 100) : 0;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Today's Progress</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>{adherenceRate}%</Text>
          <Text style={styles.progressLabel}>Adherence</Text>
        </View>
      </View>

      <ProgressBar
        progress={adherenceRate / 100}
        color={COLORS.success}
        height={8}
        style={styles.progressBar}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: COLORS.success }]} />
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{taken}</Text>
            <Text style={styles.statLabel}>Taken</Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: COLORS.warning }]} />
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: COLORS.error }]} />
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{skipped}</Text>
            <Text style={styles.statLabel}>Skipped</Text>
          </View>
        </View>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Medications</Text>
        <Text style={styles.totalNumber}>{total}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.success,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  progressBar: {
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  totalNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default TimelineSummary;
