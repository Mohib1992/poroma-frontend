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
import { loginSchema, LoginFormData } from '../../validators/auth.validator';
import { AuthStackParamList } from '../../navigation/types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const COLORS = {
  primary: '#002c28',
  primaryContainer: '#002c28',
  secondary: '#056a62',
  secondaryContainer: '#9eeee4',
  surface: '#f8faf8',
  surfaceContainerLow: '#f2f4f2',
  surfaceContainerLowest: '#ffffff',
  onSurface: '#191c1b',
  onSurfaceVariant: '#414847',
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  primaryFixed: '#c1ebe4',
  outline: '#717977',
  outlineVariant: '#c0c8c6',
  background: '#f8faf8',
  error: '#ba1a1a',
  white: '#ffffff',
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error, [
        { text: 'OK', onPress: clearError },
      ]);
    }
  }, [error, clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.phone, data.password);
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
          {/* Top App Bar */}
          <View style={styles.topBar}>
            <View style={styles.logoSection}>
              <MaterialCommunityIcons
                name="spa"
                size={28}
                color={COLORS.primary}
              />
              <Text style={styles.logoText}>পরমা</Text>
            </View>
            <TouchableOpacity style={styles.helpButton}>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={24}
                color={COLORS.onSurface}
              />
            </TouchableOpacity>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroIconContainer}>
              <MaterialCommunityIcons
                name="pill"
                size={48}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.heroTitle}>Your wellness sanctuary awaits.</Text>
            <Text style={styles.heroSubtitle}>
              Professional health curation at your fingertips.
            </Text>
          </View>

          {/* Login Form Card */}
          <View style={styles.formCard}>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="PHONE NUMBER"
                  placeholder="+88017XXXXXXXX"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
                  autoCapitalize="none"
                  leftIcon="call-outline"
                  containerStyle={styles.inputContainer}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.passwordContainer}>
                  <Input
                    label="PASSWORD"
                    placeholder="••••••••"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={errors.password?.message}
                    leftIcon="lock-closed-outline"
                    containerStyle={styles.inputContainer}
                  />
                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <Button
              title="Log In"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              size="large"
              style={styles.loginButton}
            />

            {/* Social Login Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialCommunityIcons
                  name="google"
                  size={24}
                  color={COLORS.onSurface}
                />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialCommunityIcons
                  name="apple"
                  size={24}
                  color={COLORS.onSurface}
                />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('SignUp')}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Background Decoration */}
      <View style={styles.backgroundDecorTop} />
      <View style={styles.backgroundDecorBottom} />
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
    paddingTop: 16,
    paddingBottom: 48,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontFamily: 'Manrope',
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  heroIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: 'Manrope',
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primaryContainer,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#191c1b',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  passwordContainer: {
    marginBottom: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  loginButton: {
    marginTop: 8,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.outlineVariant,
    opacity: 0.3,
  },
  dividerText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    opacity: 0.6,
    letterSpacing: 1,
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    opacity: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialButtonText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  footer: {
    alignItems: 'center',
    marginTop: 48,
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
  },
  linkText: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  backgroundDecorTop: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 256,
    height: 256,
    backgroundColor: COLORS.secondary,
    opacity: 0.05,
    borderRadius: 128,
    transform: [{ translateX: 128 }, { translateY: -128 }],
  },
  backgroundDecorBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 384,
    height: 384,
    backgroundColor: COLORS.primaryFixed,
    opacity: 0.2,
    borderRadius: 192,
    transform: [{ translateX: -192 }, { translateY: 192 }],
  },
});

export default LoginScreen;