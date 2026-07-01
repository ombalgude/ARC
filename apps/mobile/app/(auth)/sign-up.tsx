import { useSignUp } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useState } from 'react';
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

// ARC dark-mode color palette
const C = {
  background: '#0A0912',
  card: '#12102A',
  foreground: '#EAE8FF',
  brand: '#8F6FFF',
  textSecondary: '#9890BC',
  textTertiary: '#5E5880',
  border: 'rgba(143, 111, 255, 0.12)',
  inputBg: 'rgba(255, 255, 255, 0.06)',
  muted: 'rgba(255, 255, 255, 0.06)',
  destructive: '#FF6B6B',
  health: '#00EDD0',
} as const;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unable to create account. Please try again.';
}

function ArcWordmark() {
  return (
    <View style={wordmarkStyles.container}>
      <View style={wordmarkStyles.iconWrapper}>
        <View style={wordmarkStyles.outerRing} />
        <View style={wordmarkStyles.innerRing} />
        <View style={wordmarkStyles.dot} />
      </View>
      <Text style={wordmarkStyles.text}>ARC</Text>
    </View>
  );
}

const wordmarkStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconWrapper: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  outerRing: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#8F6FFF',
    borderBottomColor: 'transparent',
  },
  innerRing: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: 'rgba(124,92,252,0.35)',
    borderBottomColor: 'transparent',
  },
  dot: {
    position: 'absolute',
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#8F6FFF',
  },
  text: { fontSize: 20, fontWeight: '800', color: '#EAE8FF', letterSpacing: 2 },
});

// ── Registration Form Sub-Component ──────────────────────────────────────────

interface RegistrationFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
}

function RegistrationForm({ onSubmit, isSubmitting, errorMessage }: RegistrationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = !isSubmitting && name.trim().length > 0 && email.trim().length > 0 && password.length >= 8;

  return (
    <>
      <View style={formStyles.inputGroup}>
        <View style={formStyles.inputWrapper}>
          <Text style={formStyles.inputIcon}>👤</Text>
          <TextInput
            id="sign-up-name-input"
            autoCapitalize="words"
            autoComplete="name"
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor={C.textTertiary}
            style={formStyles.input}
            value={name}
          />
        </View>

        <View style={formStyles.inputWrapper}>
          <Text style={formStyles.inputIcon}>✉</Text>
          <TextInput
            id="sign-up-email-input"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor={C.textTertiary}
            style={formStyles.input}
            value={email}
          />
        </View>

        <View style={formStyles.inputWrapper}>
          <Text style={formStyles.inputIcon}>🔒</Text>
          <TextInput
            id="sign-up-password-input"
            onChangeText={setPassword}
            placeholder="Create password (min 8 chars)"
            placeholderTextColor={C.textTertiary}
            secureTextEntry={!showPassword}
            style={[formStyles.input, formStyles.inputWithTrailing]}
            value={password}
          />
          <Pressable
            id="sign-up-toggle-password-btn"
            onPress={() => setShowPassword((v) => !v)}
            style={formStyles.trailingAction}
          >
            <Text>{showPassword ? '🙈' : '👁'}</Text>
          </Pressable>
        </View>
      </View>

      {errorMessage ? (
        <View style={formStyles.errorBanner}>
          <Text style={formStyles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <Pressable
        id="sign-up-submit-btn"
        disabled={!canSubmit}
        onPress={() => void onSubmit(name, email, password)}
        style={({ pressed }) => [
          formStyles.primaryButton,
          !canSubmit && formStyles.primaryButtonDisabled,
          pressed && formStyles.pressed,
        ]}
      >
        <LinearGradient
          colors={['#7665F5', '#9B6FF5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={formStyles.primaryButtonGradient}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={formStyles.primaryButtonText}>Create Account</Text>
          )}
        </LinearGradient>
      </Pressable>
    </>
  );
}

// ── Email Verification Sub-Component ─────────────────────────────────────────

interface VerificationFormProps {
  onVerify: (code: string) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
}

function VerificationForm({ onVerify, isSubmitting, errorMessage }: VerificationFormProps) {
  const [code, setCode] = useState('');

  return (
    <>
      <Text style={verifyStyles.message}>
        We sent a 6-digit verification code to your email. Enter it below to activate your account.
      </Text>

      <View style={verifyStyles.codeWrapper}>
        <TextInput
          id="sign-up-verification-code-input"
          autoComplete="one-time-code"
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={setCode}
          placeholder="• • • • • •"
          placeholderTextColor={C.textTertiary}
          style={verifyStyles.codeInput}
          textAlign="center"
          value={code}
        />
      </View>

      {errorMessage ? (
        <View style={verifyStyles.errorBanner}>
          <Text style={verifyStyles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <Pressable
        id="sign-up-verify-btn"
        disabled={isSubmitting || code.length < 6}
        onPress={() => void onVerify(code)}
        style={({ pressed }) => [
          verifyStyles.primaryButton,
          (isSubmitting || code.length < 6) && verifyStyles.primaryButtonDisabled,
          pressed && verifyStyles.pressed,
        ]}
      >
        <LinearGradient
          colors={['#7665F5', '#9B6FF5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={verifyStyles.primaryButtonGradient}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={verifyStyles.primaryButtonText}>Verify Email</Text>
          )}
        </LinearGradient>
      </Pressable>
    </>
  );
}

const formStyles = StyleSheet.create({
  inputGroup: { gap: 12, marginBottom: 12 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.inputBg,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  inputIcon: { fontSize: 16, marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: C.foreground, paddingVertical: 14 },
  inputWithTrailing: { paddingRight: 8 },
  trailingAction: { padding: 8, marginRight: -8 },
  errorBanner: {
    backgroundColor: 'rgba(255,107,107,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, color: C.destructive, fontWeight: '500' },
  primaryButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: -0.16 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
});

const verifyStyles = StyleSheet.create({
  message: { fontSize: 15, color: C.textSecondary, lineHeight: 23, marginBottom: 24 },
  codeWrapper: {
    backgroundColor: C.inputBg,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  codeInput: {
    fontSize: 28,
    fontWeight: '700',
    color: C.foreground,
    paddingVertical: 16,
    letterSpacing: 10,
  },
  errorBanner: {
    backgroundColor: 'rgba(255,107,107,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, color: C.destructive, fontWeight: '500' },
  primaryButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: -0.16 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
});

// ── Main Sign-Up Screen ───────────────────────────────────────────────────────

export default function SignUpScreen(): React.JSX.Element {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUp(name: string, email: string, password: string): Promise<void> {
    if (!isLoaded || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signUp.create({
        firstName: name.split(' ')[0] ?? name,
        lastName: name.split(' ').slice(1).join(' ') || undefined,
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerification(code: string): Promise<void> {
    if (!isLoaded || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/onboarding');
      } else {
        setErrorMessage('Verification incomplete. Please try again.');
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

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
            id="sign-up-back-btn"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <ArcWordmark />
            <Text style={styles.title}>
              {pendingVerification ? 'Check your email' : 'Create your account'}
            </Text>
            <Text style={styles.subtitle}>
              {pendingVerification
                ? 'Enter the 6-digit code we sent you'
                : 'Start building your best self today'}
            </Text>
          </View>

          {/* Social Auth (registration only) */}
          {!pendingVerification && (
            <>
              <View style={styles.socialGroup}>
                <Pressable
                  id="sign-up-google-btn"
                  style={({ pressed }) => [styles.socialButton, pressed && styles.pressed]}
                >
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </Pressable>
                <Pressable
                  id="sign-up-apple-btn"
                  style={({ pressed }) => [styles.socialButton, pressed && styles.pressed]}
                >
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </Pressable>
              </View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>
            </>
          )}

          {/* Form */}
          {pendingVerification ? (
            <VerificationForm
              onVerify={handleVerification}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          ) : (
            <RegistrationForm
              onSubmit={handleSignUp}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          )}

          {/* Terms + Sign In (registration only) */}
          {!pendingVerification && (
            <>
              <Text style={styles.termsText}>
                {'By creating an account, you agree to our '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' and '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
              <View style={styles.switchAuth}>
                <Text style={styles.switchAuthText}>{'Already have an account? '}</Text>
                <Link href="/(auth)/sign-in" style={styles.switchAuthLink}>
                  Sign In
                </Link>
              </View>
            </>
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
  header: { marginBottom: 28, marginTop: 8 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: C.foreground,
    letterSpacing: -0.84,
    marginTop: 16,
    marginBottom: 6,
  },
  subtitle: { fontSize: 15, color: C.textSecondary },
  socialGroup: { gap: 10, marginBottom: 20 },
  socialButton: {
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: { fontSize: 14, fontWeight: '600', color: C.foreground },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 12, fontWeight: '600', color: C.textTertiary, letterSpacing: 0.5 },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: C.textTertiary,
    lineHeight: 19,
    marginTop: 4,
    marginBottom: 4,
  },
  termsLink: { color: C.brand, fontWeight: '600' },
  switchAuth: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  switchAuthText: { fontSize: 14, color: C.textSecondary },
  switchAuthLink: { fontSize: 14, fontWeight: '700', color: C.brand },
});
