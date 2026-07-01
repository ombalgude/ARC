import { useSignIn } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Appearance } from 'react-native';
import { LightColors, DarkColors } from '../../../../packages/ui/src/tokens/theme';

const isDark = Appearance.getColorScheme() === 'dark';
const C = isDark ? DarkColors : LightColors;

type Stage = 'email' | 'reset' | 'success';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

function InputRow({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  maxLength,
  id,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  secureTextEntry?: boolean;
  maxLength?: number;
  id: string;
}) {
  return (
    <View style={inputStyles.wrapper}>
      <Ionicons name={icon} size={20} color={C.textTertiary} style={inputStyles.iconVector} />
      <TextInput
        id={id}
        autoCapitalize="none"
        keyboardType={keyboardType}
        maxLength={maxLength}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textTertiary}
        secureTextEntry={secureTextEntry}
        style={inputStyles.input}
        value={value}
      />
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.inputBackground,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    minHeight: 52,
    marginBottom: 12,
  },
  iconVector: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: C.foreground, paddingVertical: 14 },
});

export default function ForgotPasswordScreen(): React.JSX.Element {
  const { isLoaded, signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState<Stage>('email');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSendCode(): Promise<void> {
    if (!isLoaded || isSubmitting || !email) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setStage('reset');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(): Promise<void> {
    if (!isLoaded || isSubmitting || !code || !newPassword) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      });

      if (result.status === 'complete') {
        setStage('success');
      } else {
        setErrorMessage('Could not reset password. Please try again.');
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const stageConfig = {
    email: {
      icon: '🔑',
      title: 'Reset Password',
      subtitle: "Enter your email address and we'll send you a reset code.",
    },
    reset: {
      icon: '📧',
      title: 'Enter Code',
      subtitle: 'Check your email for a 6-digit code and enter your new password below.',
    },
    success: {
      icon: '✅',
      title: 'Password Reset!',
      subtitle:
        'Your password has been reset successfully. Sign in with your new password.',
    },
  }[stage];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <Pressable
            id="forgot-password-back-btn"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name={stageConfig.icon as any} size={32} color={C.brand} />
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.title}>{stageConfig.title}</Text>
          <Text style={styles.subtitle}>{stageConfig.subtitle}</Text>

          {/* ── Stage: Email ── */}
          {stage === 'email' && (
            <>
              <InputRow
                id="forgot-password-email-input"
                icon="mail-outline"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email address"
                value={email}
              />

              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              <Pressable
                id="forgot-password-send-code-btn"
                disabled={isSubmitting || !email}
                onPress={handleSendCode}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (isSubmitting || !email) && styles.primaryButtonDisabled,
                  pressed && styles.pressed,
                ]}
              >
                <LinearGradient
                  colors={['#7665F5', '#9B6FF5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryButtonGradient}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Send Reset Code</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </>
          )}

          {/* ── Stage: Reset ── */}
          {stage === 'reset' && (
            <>
              <InputRow
                id="forgot-password-code-input"
                icon="keypad-outline"
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={setCode}
                placeholder="6-digit code"
                value={code}
              />
              <InputRow
                id="forgot-password-new-password-input"
                icon="lock-closed-outline"
                onChangeText={setNewPassword}
                placeholder="New password"
                secureTextEntry
                value={newPassword}
              />

              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              <Pressable
                id="forgot-password-reset-btn"
                disabled={isSubmitting || !code || !newPassword}
                onPress={handleResetPassword}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (isSubmitting || !code || !newPassword) && styles.primaryButtonDisabled,
                  pressed && styles.pressed,
                ]}
              >
                <LinearGradient
                  colors={['#7665F5', '#9B6FF5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryButtonGradient}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Reset Password</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </>
          )}

          {/* ── Stage: Success ── */}
          {stage === 'success' && (
            <Pressable
              id="forgot-password-signin-btn"
              onPress={() => router.replace('/(auth)/sign-in')}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <LinearGradient
                colors={['#7665F5', '#9B6FF5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Back to Sign In</Text>
              </LinearGradient>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  backButton: { marginTop: 8, marginBottom: 8, alignSelf: 'flex-start', paddingVertical: 8 },
  backButtonText: { fontSize: 15, color: C.brand, fontWeight: '600' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(143, 111, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  icon: { fontSize: 32 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: C.foreground,
    letterSpacing: -0.84,
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: C.textSecondary, lineHeight: 23, marginBottom: 28 },
  errorBanner: {
    backgroundColor: 'rgba(255,107,107,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, color: C.destructive, fontWeight: '500' },
  primaryButton: { borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: -0.16 },
});
