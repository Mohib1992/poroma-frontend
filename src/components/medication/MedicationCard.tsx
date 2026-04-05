import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Medication } from '../../types';
import { Card } from '../common/Card';
import { Ionicons } from '@expo/vector-icons';

interface MedicationCardProps {
  medication: Medication;
  onPress?: () => void;
  style?: ViewStyle;
}

const COLORS = {
  primary: '#2196F3',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  black: '#212121',
  gray: '#757575',
  lightGray: '#BDBDBD',
};

const frequencyLabels: Record<string, string> = {
  once_daily: 'Once Daily',
  twice_daily: 'Twice Daily',
  three_times: 'Three Times',
  four_times: 'Four Times',
  as_needed: 'As Needed',
  weekly: 'Weekly',
};

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onPress,
  style,
}) => {
  const getStatusColor = () => {
    if (!medication.is_active) return COLORS.lightGray;
    if (medication.stock_count !== undefined && medication.stock_count <= 0) {
      return COLORS.error;
    }
    return COLORS.success;
  };

  const formatTimes = (times: string[]) => {
    if (times.length === 0) return '';
    return times.join(', ');
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <Card style={[styles.card, style]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>{medication.name}</Text>
            {medication.name_bn && (
              <Text style={styles.nameBn}>{medication.name_bn}</Text>
            )}
          </View>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
          />
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons
              name="medical-outline"
              size={16}
              color={COLORS.gray}
            />
            <Text style={styles.detailText}>{medication.dosage}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="repeat-outline"
              size={16}
              color={COLORS.gray}
            />
            <Text style={styles.detailText}>
              {frequencyLabels[medication.frequency] || medication.frequency}
            </Text>
          </View>

          {medication.times.length > 0 && (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={COLORS.gray} />
              <Text style={styles.detailText}>
                {formatTimes(medication.times)}
              </Text>
            </View>
          )}
        </View>

        {medication.stock_count !== undefined && (
          <View style={styles.stockContainer}>
            <View style={styles.stockInfo}>
              <Ionicons name="cube-outline" size={16} color={COLORS.gray} />
              <Text
                style={[
                  styles.stockText,
                  medication.stock_count <= 5 && styles.lowStockText,
                ]}
              >
                {medication.stock_count} remaining
              </Text>
            </View>
            {medication.stock_count <= 5 && (
              <View style={styles.refillBadge}>
                <Text style={styles.refillBadgeText}>Refill soon</Text>
              </View>
            )}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  nameBn: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  stockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockText: {
    fontSize: 13,
    color: COLORS.gray,
  },
  lowStockText: {
    color: COLORS.error,
    fontWeight: '500',
  },
  refillBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  refillBadgeText: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '500',
  },
});

export default MedicationCard;
