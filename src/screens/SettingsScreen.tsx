import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#2196F3',
  black: '#212121',
  darkGray: '#424242',
  gray: '#757575',
  lightGray: '#BDBDBD',
  background: '#F5F5F5',
  white: '#FFFFFF',
  error: '#F44336',
  success: '#4CAF50',
};

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightElement,
  danger = false,
}) => (
  <TouchableOpacity
    style={styles.settingsItem}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={[styles.iconContainer, danger && styles.dangerIconContainer]}>
      <Ionicons
        name={icon}
        size={22}
        color={danger ? COLORS.error : COLORS.primary}
      />
    </View>
    <View style={styles.settingsItemContent}>
      <Text style={[styles.settingsItemTitle, danger && styles.dangerText]}>
        {title}
      </Text>
      {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
    </View>
    {rightElement}
    {showArrow && onPress && (
      <Ionicons name="chevron-forward" size={20} color={COLORS.lightGray} />
    )}
  </TouchableOpacity>
);

export const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();

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
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.card}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                <Text style={styles.profilePhone}>{user?.phone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <SettingsItem
              icon="person-outline"
              title="Edit Profile"
              onPress={() => {}}
            />
            <SettingsItem
              icon="call-outline"
              title="Phone Number"
              subtitle={user?.phone}
              showArrow={false}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Card style={styles.card}>
            <SettingsItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Manage notification settings"
              onPress={() => {}}
            />
            <SettingsItem
              icon="moon-outline"
              title="Dark Mode"
              subtitle="Coming soon"
              onPress={() => {}}
              rightElement={
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Soon</Text>
                </View>
              }
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Card style={styles.card}>
            <SettingsItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={handleTermsOfService}
            />
            <SettingsItem
              icon="shield-outline"
              title="Privacy Policy"
              onPress={handlePrivacyPolicy}
            />
            <SettingsItem
              icon="help-circle-outline"
              title="Help & Support"
              onPress={handleSupport}
            />
            <SettingsItem
              icon="information-circle-outline"
              title="About পরমা"
              subtitle="Version 1.0.0"
              showArrow={false}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Card style={styles.card}>
            <SettingsItem
              icon="log-out-outline"
              title="Logout"
              onPress={handleLogout}
              showArrow={false}
              danger
            />
          </Card>
        </View>

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
  header: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.white,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  profilePhone: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIconContainer: {
    backgroundColor: '#FFEBEE',
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    color: COLORS.black,
  },
  settingsItemSubtitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  dangerText: {
    color: COLORS.error,
  },
  comingSoonBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  comingSoonText: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.lightGray,
    marginTop: 4,
  },
});

export default SettingsScreen;
