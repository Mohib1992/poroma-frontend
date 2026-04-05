import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ViewStyle,
} from 'react-native';
import { Medication } from '../../types';
import { MedicationCard } from './MedicationCard';
import { EmptyState } from '../common/EmptyState';

interface MedicationListProps {
  medications: Medication[];
  onPress?: (medication: Medication) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  onAddPress?: () => void;
  emptyTitle?: string;
  emptySubtitle?: string;
  style?: ViewStyle;
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  onPress,
  refreshing = false,
  onRefresh,
  onAddPress,
  emptyTitle = 'No medications yet',
  emptySubtitle = 'Add your first medication to start tracking',
  style,
}) => {
  const renderItem = ({ item }: { item: Medication }) => (
    <MedicationCard
      medication={item}
      onPress={onPress ? () => onPress(item) : undefined}
    />
  );

  if (medications.length === 0 && !refreshing) {
    return (
      <EmptyState
        icon="💊"
        title={emptyTitle}
        subtitle={emptySubtitle}
        actionLabel={onAddPress ? 'Add Medication' : undefined}
        onAction={onAddPress}
        style={style}
      />
    );
  }

  return (
    <FlatList
      data={medications}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={[styles.list, style]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
});

export default MedicationList;
