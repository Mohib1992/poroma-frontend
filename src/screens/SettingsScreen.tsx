import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

const COLORS = {
  primary: '#002c28',
  primaryContainer: '#002c28',
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
  primaryFixed: '#c1ebe4',
  outline: '#717977',
  outlineVariant: '#c0c8c6',
  background: '#f8faf8',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  white: '#ffffff',
};

interface SettingsToggleProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({
  title,
  subtitle,
  value,
  onValueChange,
}) => (
  <View style={styles.toggleItem}>
    <View style={styles.toggleInfo}>
      <Text style={styles.toggleTitle}>{title}</Text>
      {subtitle && <Text style={styles.toggleSubtitle}>{subtitle}</Text>}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.surfaceContainerHigh, true: COLORS.secondary }}
      thumbColor={COLORS.white}
    />
  </View>
);

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  danger = false,
}) => (
  <TouchableOpacity
    style={styles.settingsItem}
    onPress={onPress}
    disabled={!onPress}
  >
    <View
      style={[
        styles.iconContainer,
        danger ? styles.dangerIconContainer : styles.normalIconContainer,
      ]}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={22}
        color={danger ? COLORS.error : COLORS.secondary}
      />
    </View>
    <View style={styles.settingsItemContent}>
      <Text style={[styles.settingsItemTitle, danger && styles.dangerText]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
      )}
    </View>
    {showArrow && onPress && (
      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={COLORS.outline}
      />
    )}
  </TouchableOpacity>
);

export const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [reminderSounds, setReminderSounds] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [missedDoseAlerts, setMissedDoseAlerts] = useState(true);

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://poroma.app/terms');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://poroma.app/privacy');
  };

  const handleSupport = () => {
    Linking.openURL('mailto:support@poroma.app');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="menu"
              size={28}
              color={COLORS.primary}
            />
            <Text style={styles.headerTitle}>পরমা</Text>
          </View>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{getInitials()}</Text>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitleLarge}>Settings</Text>
          <TouchableOpacity style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>{getInitials()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.name || 'User'}
              </Text>
              <Text style={styles.profileEmail}>
                {user?.phone || 'No phone number'}
              </Text>
              <TouchableOpacity>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.card}>
            <SettingsToggle
              title="Push Notifications"
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
            <View style={styles.divider} />
            <SettingsToggle
              title="Reminder Sounds"
              value={reminderSounds}
              onValueChange={setReminderSounds}
            />
            <View style={styles.divider} />
            <SettingsToggle
              title="Daily Summary"
              value={dailySummary}
              onValueChange={setDailySummary}
            />
            <View style={styles.divider} />
            <SettingsToggle
              title="Missed Dose Alerts"
              value={missedDoseAlerts}
              onValueChange={setMissedDoseAlerts}
            />
          </View>
        </View>

        {/* Display & Accessibility Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DISPLAY & ACCESSIBILITY</Text>
          <View style={styles.card}>
            <SettingsItem
              icon="theme-light-dark"
              title="Theme"
              subtitle="Light"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingsItem
              icon="text-size"
              title="Text Size"
              subtitle="Default"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.card}>
            <SettingsItem
              icon="file-document-outline"
              title="Terms of Service"
              onPress={handleTermsOfService}
            />
            <View style={styles.divider} />
            <SettingsItem
              icon="shield-check-outline"
              title="Privacy Policy"
              onPress={handlePrivacyPolicy}
            />
            <View style={styles.divider} />
            <SettingsItem
              icon="help-circle-outline"
              title="Help & Support"
              onPress={handleSupport}
            />
            <View style={styles.divider} />
            <SettingsItem
              icon="information-outline"
              title="About পরমা"
              subtitle="Version 1.0.0"
              showArrow={false}
            />
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <View style={styles.card}>
            <SettingsItem
              icon="logout"
              title="Logout"
              onPress={handleLogout}
              showArrow={false}
              danger
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>পরমা v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with care in Bangladesh</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontFamily: 'Manrope',
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  headerAvatarText: {
    fontFamily: 'Manrope',
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  profileSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sectionTitleLarge: {
    fontFamily: 'Manrope',
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -1,
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontFamily: 'Manrope',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.onPrimary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Manrope',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  profileEmail: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  editProfileText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryContainer,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 24,
    padding: 4,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  toggleInfo: {},
  toggleTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.onSurface,
  },
  toggleSubtitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: COLORS.outline,
    marginTop: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  normalIconContainer: {
    backgroundColor: COLORS.secondaryContainer,
  },
  dangerIconContainer: {
    backgroundColor: COLORS.errorContainer,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLORS.onSurface,
  },
  settingsItemSubtitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: COLORS.outline,
    marginTop: 2,
  },
  dangerText: {
    color: COLORS.error,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    marginHorizontal: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
  },
  footerSubtext: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: COLORS.outline,
    marginTop: 4,
  },
});

export default SettingsScreen;