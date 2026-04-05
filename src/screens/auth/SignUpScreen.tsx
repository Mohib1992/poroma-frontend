import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import {
  registerSchema,
  RegisterFormData,
} from '../../validators/auth.validator';
import { AuthStackParamList } from '../../navigation/types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SignUp'
>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

const COLORS = {
  primary: '#002c28',
  primaryContainer: '#00443e',
  secondary: '#056a62',
  secondaryContainer: '#9eeee4',
  surface: '#f8faf8',
  surfaceContainerLow: '#f2f4f2',
  surfaceContainerLowest: '#ffffff',
  onSurface: '#191c1b',
  onSurfaceVariant: '#404947',
  onPrimary: '#ffffff',
  primaryFixed: '#b4eee5',
  outline: '#707977',
  outlineVariant: '#bfc8c6',
  background: '#f8faf8',
  error: '#ba1a1a',
  white: '#ffffff',
};

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Failed', error, [
        { text: 'OK', onPress: clearError },
      ]);
    }
  }, [error, clearError]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.phone, data.password, data.name);
    } catch {
      // Error is handled by useEffect
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Navigation */}
          <View style={styles.topNav}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={COLORS.primaryContainer}
              />
            </TouchableOpacity>
            <Text style={styles.topNavTitle}>Create Account</Text>
            <Text style={styles.topNavLogo}>পরমা</Text>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Create Account</Text>
            <Text style={styles.heroSubtitle}>
              Start your wellness journey today
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>FULL NAME</Text>
                  <Input
                    placeholder="Enter your full name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                    autoCapitalize="words"
                    leftIcon="person-outline"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                  <Input
                    placeholder="+88017XXXXXXXX"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                    error={errors.phone?.message}
                    autoCapitalize="none"
                    leftIcon="call-outline"
                  />
                </View>
              )}
            />

            {/* Password Container */}
            <View style={styles.passwordContainer}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>PASSWORD</Text>
                    <Input
                      placeholder="Create a secure password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      error={errors.password?.message}
                      leftIcon="lock-closed-outline"
                    />
                    <Text style={styles.passwordHint}>
                      Must contain 8+ characters, one uppercase letter, and one
                      symbol.
                    </Text>
                  </View>
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                    <Input
                      placeholder="Repeat your password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      error={errors.confirmPassword?.message}
                      leftIcon="lock-closed-outline"
                    />
                  </View>
                )}
              />
            </View>

            {/* Terms Agreement */}
            <View style={styles.termsContainer}>
              <TouchableOpacity style={styles.checkbox}>
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={22}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms and Conditions</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
            </View>

            {/* Create Account Button */}
            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              size="large"
              style={styles.createButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Decorative Element */}
          <View style={styles.decorativeElement}>
            <View style={styles.decorativeCircle} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Decorative Illustration */}
      <View style={styles.bottomDecor} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 96,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    height: 80,
  },
  backButton: {
    padding: 8,
    transform: [{ scale: 0.95 }],
  },
  topNavTitle: {
    fontFamily: 'Manrope',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primaryContainer,
    letterSpacing: -0.5,
  },
  topNavLogo: {
    fontFamily: 'Manrope',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  heroSection: {
    marginTop: 16,
    marginBottom: 48,
  },
  heroTitle: {
    fontFamily: 'Manrope',
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -1,
    marginBottom: 8,
    lineHeight: 42,
  },
  heroSubtitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    color: COLORS.onSurfaceVariant,
    lineHeight: 26,
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  passwordContainer: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 48,
    padding: 16,
    marginTop: 8,
  },
  passwordHint: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    opacity: 0.7,
    fontStyle: 'italic',
    marginTop: 4,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    marginTop: 32,
    paddingHorizontal: 4,
  },
  checkbox: {
    marginTop: 2,
    marginRight: 12,
  },
  termsText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(0, 44, 40, 0.3)',
  },
  createButton: {
    marginTop: 24,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 48,
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },
  linkText: {
    fontFamily: 'Manrope',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  decorativeElement: {
    marginTop: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    opacity: 0.2,
  },
  decorativeCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: COLORS.secondaryContainer,
    opacity: 0.5,
  },
  bottomDecor: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 150,
    height: 256,
    backgroundColor: COLORS.surface,
    opacity: 0.1,
    borderTopLeftRadius: 100,
  },
});

export default SignUpScreen;