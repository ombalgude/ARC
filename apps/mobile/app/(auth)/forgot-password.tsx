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

// ─── 4-Stage Flow ────────────────────────────────────────────────────────────
// 'email'    → User enters their email address → we send a reset code
// 'code'     → User enters the 6-digit code from their email
// 'password' → User sets a new password (entered twice for confirmation)
// 'success'  → Password updated → redirect to sign-in
type Stage = 'email' | 'code' | 'password' | 'success';

const STAGE_STEPS: Stage[] = ['email', 'code', 'password'];

// ─── Clerk Error Parser ───────────────────────────────────────────────────────
function getErrorMessage(error: unknown): string {
  if (
    error !== null &&
    typeof error === 'object' &&
    'errors' in error &&
    Array.isArray((error as { errors: unknown[] }).errors)
  ) {
    const clerkError = (error as { errors: { longMessage?: string; message?: string } }[]).at(0);
    if (clerkError !== undefined && typeof clerkError === 'object') {
      const e = clerkError as { longMessage?: string; message?: string };
      return e.longMessage ?? e.message ?? 'Something went wrong. Please try again.';
    }
    // Fallback: re-cast and use .at()
    const clerkErr2 = (error as { errors: { longMessage?: string; message?: string }[] }).errors.at(0);
    if (clerkErr2 !== undefined) {
      return clerkErr2.longMessage ?? clerkErr2.message ?? 'Something went wrong. Please try again.';
    }
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

// ─── Progress Stepper ────────────────────────────────────────────────────────
function StepProgress({ currentStage }: { currentStage: Stage }) {
  const currentIdx = STAGE_STEPS.indexOf(currentStage);
  if (currentIdx === -1) return null; // don't show on success

  return (
    <View style={stepStyles.container}>
      {STAGE_STEPS.map((s, idx) => {
        const isCompleted = idx < currentIdx;
        const isActive = idx === currentIdx;
        return (
          <React.Fragment key={s}>
            <View
              style={[
                stepStyles.dot,
                isActive && stepStyles.dotActive,
                isCompleted && stepStyles.dotCompleted,
              ]}
            >
              {isCompleted ? (
                <Ionicons name="checkmark" size={10} color="#FFFFFF" />
              ) : (
                <View style={[stepStyles.dotInner, isActive && stepStyles.dotInnerActive]} />
              )}
            </View>
            {idx < STAGE_STEPS.length - 1 && (
              <View style={[stepStyles.line, isCompleted && stepStyles.lineCompleted]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.muted,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: C.brand,
    borderColor: C.brand,
  },
  dotCompleted: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.textTertiary,
  },
  dotInnerActive: {
    backgroundColor: '#FFFFFF',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: C.border,
    marginHorizontal: 6,
    maxWidth: 48,
  },
  lineCompleted: {
    backgroundColor: '#22C55E',
  },
});

// ─── Reusable Input ───────────────────────────────────────────────────────────
function InputField({
  id,
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  maxLength,
  trailingIcon,
  onTrailingPress,
}: {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  secureTextEntry?: boolean;
  maxLength?: number;
  trailingIcon?: React.ComponentProps<typeof Ionicons>['name'];
  onTrailingPress?: () => void;
}) {
  return (
    <View style={fieldStyles.wrapper}>
      <Ionicons name={icon} size={20} color={C.textTertiary} style={fieldStyles.leadIcon} />
      <TextInput
        id={id}
        autoCapitalize="none"
        keyboardType={keyboardType}
        maxLength={maxLength}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textTertiary}
        secureTextEntry={secureTextEntry}
        style={[fieldStyles.input, trailingIcon != null && fieldStyles.inputWithTrail]}
        value={value}
      />
      {trailingIcon != null && onTrailingPress != null && (
        <Pressable onPress={onTrailingPress} style={fieldStyles.trailBtn} hitSlop={8}>
          <Ionicons name={trailingIcon} size={20} color={C.textTertiary} />
        </Pressable>
      )}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.inputBackground,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    minHeight: 54,
    marginBottom: 12,
  },
  leadIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: C.foreground, paddingVertical: 14 },
  inputWithTrail: { paddingRight: 8 },
  trailBtn: { padding: 6, marginRight: -6 },
});

// ─── Error Banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ message }: { message: string }) {
  return (
    <View style={errStyles.banner}>
      <Ionicons name="alert-circle-outline" size={15} color={C.destructive} style={errStyles.icon} />
      <Text style={errStyles.text}>{message}</Text>
    </View>
  );
}

const errStyles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,107,107,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  icon: { marginTop: 1 },
  text: { flex: 1, fontSize: 13, color: C.destructive, fontWeight: '500', lineHeight: 19 },
});

// ─── Primary Button ───────────────────────────────────────────────────────────
function PrimaryButton({
  id,
  label,
  onPress,
  disabled = false,
  loading = false,
}: {
  id: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      id={id}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        btnStyles.wrapper,
        disabled && btnStyles.disabled,
        pressed && btnStyles.pressed,
      ]}
    >
      <LinearGradient
        colors={['#7665F5', '#9B6FF5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={btnStyles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={btnStyles.label}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const btnStyles = StyleSheet.create({
  wrapper: { borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  gradient: { paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  label: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: -0.16 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ForgotPasswordScreen(): React.JSX.Element {
  // setActive is required — after attemptFirstFactor completes, Clerk has already
  // created a session internally. We MUST call setActive() to commit the token to
  // SecureStore. Without it the user gets a "session already exists" error on sign-in.
  const { isLoaded, signIn, setActive } = useSignIn();

  // Stage state
  const [stage, setStage] = useState<Stage>('email');

  // Field values — kept across stage transitions
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Back navigation with per-stage logic ───────────────────────────────────
  function handleBack(): void {
    setErrorMessage(null);
    if (stage === 'email') {
      router.back();
    } else if (stage === 'code') {
      // Go back to email — user can change email if needed
      setStage('email');
    } else if (stage === 'password') {
      // Go back to code — user can re-enter the code
      setStage('code');
    }
    // 'success' stage has no back button
  }

  // ── Stage 1: Send reset code to email ─────────────────────────────────────
  async function handleSendCode(): Promise<void> {
    if (!isLoaded || isSubmitting || !email.trim()) return;
    if (!signIn) {
      setErrorMessage('Authentication service is not ready. Please try again.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      setCode(''); // clear any previous code when (re)sending
      setStage('code');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Stage 2: Advance from code stage to password stage ────────────────────
  // Note: Clerk validates the code together with the new password in attemptFirstFactor.
  // We collect the code here and validate it when the user submits their new password.
  function handleCodeNext(): void {
    if (code.length < 6) return;
    setErrorMessage(null);
    setStage('password');
  }

  // ── Stage 3: Set new password (calls Clerk with code + password) ───────────
  async function handleResetPassword(): Promise<void> {
    if (!isLoaded || isSubmitting) return;
    if (!signIn) {
      setErrorMessage('Authentication service is not ready. Please try again.');
      return;
    }

    // Client-side validation before hitting Clerk
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match. Please check and try again.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      });

      if (result.status === 'complete') {
        // IMPORTANT: Clerk creates a session internally the moment this call succeeds.
        // We MUST call setActive() to commit that session token to SecureStore.
        // If we skip this and navigate to sign-in, Clerk will throw "session already
        // exists" when the user tries to call signIn.create() again.
        if (result.createdSessionId && setActive) {
          await setActive({ session: result.createdSessionId });
        }
        setStage('success');
      } else {
        setErrorMessage('Could not reset password. Please try again.');
      }
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMessage(msg);

      // If Clerk says the code is wrong/expired, bounce the user back to the
      // code stage so they can re-enter or request a new code.
      const msgLower = msg.toLowerCase();
      const isCodeError =
        msgLower.includes('code') ||
        msgLower.includes('verification') ||
        msgLower.includes('expired') ||
        msgLower.includes('invalid');
      if (isCodeError) {
        setCode('');
        setStage('code');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Stage config (icon, title, subtitle) ──────────────────────────────────
  const stageConfig = {
    email: {
      iconName: 'key-outline' as const,
      title: 'Reset Password',
      subtitle: "Enter the email address linked to your account and we'll send you a 6-digit reset code.",
    },
    code: {
      iconName: 'mail-open-outline' as const,
      title: 'Check Your Email',
      subtitle: `We sent a 6-digit code to ${email || 'your email'}. Enter it below to continue.`,
    },
    password: {
      iconName: 'lock-closed-outline' as const,
      title: 'Set New Password',
      subtitle: 'Choose a strong new password. Enter it twice to confirm.',
    },
    success: {
      iconName: 'checkmark-circle-outline' as const,
      title: 'Password Updated!',
      subtitle: 'Your password has been successfully reset. You are now signed in. Tap below to continue.',
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

          {/* ── Back Button (hidden on success stage) ── */}
          {stage !== 'success' && (
            <Pressable
              id="forgot-password-back-btn"
              onPress={handleBack}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <Ionicons name="arrow-back-outline" size={18} color={C.brand} style={styles.backIcon} />
              <Text style={styles.backButtonText}>
                {stage === 'email' ? 'Back' : stage === 'code' ? 'Change Email' : 'Change Code'}
              </Text>
            </Pressable>
          )}

          {/* ── Progress Stepper ── */}
          <StepProgress currentStage={stage} />

          {/* ── Stage Icon ── */}
          <View style={styles.iconContainer}>
            <Ionicons name={stageConfig.iconName} size={34} color={C.brand} />
          </View>

          {/* ── Title & Subtitle ── */}
          <Text style={styles.title}>{stageConfig.title}</Text>
          <Text style={styles.subtitle}>{stageConfig.subtitle}</Text>

          {/* ══════════════════════════════════════════════
              STAGE 1: EMAIL
          ══════════════════════════════════════════════ */}
          {stage === 'email' && (
            <>
              <InputField
                id="forgot-password-email-input"
                icon="mail-outline"
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              {errorMessage != null && <ErrorBanner message={errorMessage} />}

              <PrimaryButton
                id="forgot-password-send-code-btn"
                label="Send Reset Code"
                onPress={handleSendCode}
                disabled={isSubmitting || !email.trim()}
                loading={isSubmitting}
              />
            </>
          )}

          {/* ══════════════════════════════════════════════
              STAGE 2: CODE
          ══════════════════════════════════════════════ */}
          {stage === 'code' && (
            <>
              {/* Large centered OTP input */}
              <View style={styles.otpWrapper}>
                <TextInput
                  id="forgot-password-code-input"
                  autoComplete="one-time-code"
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={setCode}
                  placeholder="• • • • • •"
                  placeholderTextColor={C.textTertiary}
                  style={styles.otpInput}
                  textAlign="center"
                  value={code}
                />
              </View>

              {errorMessage != null && <ErrorBanner message={errorMessage} />}

              <PrimaryButton
                id="forgot-password-verify-code-btn"
                label="Verify Code"
                onPress={handleCodeNext}
                disabled={code.length < 6}
              />

              {/* Resend option */}
              <Pressable
                id="forgot-password-resend-btn"
                onPress={handleSendCode}
                disabled={isSubmitting}
                style={({ pressed }) => [styles.resendButton, pressed && styles.pressed]}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={C.brand} />
                ) : (
                  <Text style={styles.resendText}>
                    Didn{"'"}t receive it?{' '}
                    <Text style={styles.resendLink}>Resend code</Text>
                  </Text>
                )}
              </Pressable>
            </>
          )}

          {/* ══════════════════════════════════════════════
              STAGE 3: NEW PASSWORD (×2)
          ══════════════════════════════════════════════ */}
          {stage === 'password' && (
            <>
              <InputField
                id="forgot-password-new-password-input"
                icon="lock-closed-outline"
                placeholder="New password (min. 8 characters)"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                trailingIcon={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                onTrailingPress={() => setShowNewPassword((v) => !v)}
              />

              <InputField
                id="forgot-password-confirm-password-input"
                icon="lock-closed-outline"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                trailingIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                onTrailingPress={() => setShowConfirmPassword((v) => !v)}
              />

              {/* Password match indicator */}
              {confirmPassword.length > 0 && (
                <View style={styles.matchRow}>
                  <Ionicons
                    name={newPassword === confirmPassword ? 'checkmark-circle' : 'close-circle'}
                    size={15}
                    color={newPassword === confirmPassword ? '#22C55E' : C.destructive}
                    style={styles.matchIcon}
                  />
                  <Text
                    style={[
                      styles.matchText,
                      { color: newPassword === confirmPassword ? '#22C55E' : C.destructive },
                    ]}
                  >
                    {newPassword === confirmPassword ? 'Passwords match' : "Passwords don't match"}
                  </Text>
                </View>
              )}

              {errorMessage != null && <ErrorBanner message={errorMessage} />}

              <PrimaryButton
                id="forgot-password-reset-btn"
                label="Update Password"
                onPress={handleResetPassword}
                disabled={
                  isSubmitting ||
                  newPassword.length < 8 ||
                  confirmPassword.length === 0
                }
                loading={isSubmitting}
              />
            </>
          )}

          {/* ══════════════════════════════════════════════
              STAGE 4: SUCCESS
          ══════════════════════════════════════════════ */}
          {stage === 'success' && (
            <PrimaryButton
              id="forgot-password-continue-btn"
              label="Go to Dashboard"
              onPress={() => router.replace('/(app)/(tabs)/dashboard')}
            />
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },

  // Back button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 4,
    paddingVertical: 8,
    gap: 4,
  },
  backIcon: { marginTop: 1 },
  backButtonText: { fontSize: 15, color: C.brand, fontWeight: '600' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },

  // Icon container
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(143, 111, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  // Titles
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: C.foreground,
    letterSpacing: -0.84,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: C.textSecondary,
    lineHeight: 23,
    marginBottom: 28,
  },

  // OTP code input (large, centred)
  otpWrapper: {
    backgroundColor: C.inputBackground,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  otpInput: {
    fontSize: 30,
    fontWeight: '700',
    color: C.foreground,
    paddingVertical: 18,
    letterSpacing: 10,
  },

  // Password match indicator
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: -4,
    gap: 5,
  },
  matchIcon: { marginTop: 0 },
  matchText: { fontSize: 12, fontWeight: '600' },

  // Resend button
  resendButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  resendText: { fontSize: 13, color: C.textSecondary },
  resendLink: { color: C.brand, fontWeight: '700' },
});
