import { useSignIn } from '@clerk/clerk-expo';
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
  brandDark: '#7C5CFC',
  textSecondary: '#9890BC',
  textTertiary: '#5E5880',
  border: 'rgba(143, 111, 255, 0.12)',
  inputBg: 'rgba(255, 255, 255, 0.06)',
  muted: 'rgba(255, 255, 255, 0.06)',
  destructive: '#FF6B6B',
} as const;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unable to sign in. Please try again.';
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

function SocialButton({ label, onPress }: { label: string; onPress: () => void }) {
  const slug = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <Pressable
      id={`sign-in-${slug}-btn`}
      onPress={onPress}
      style={({ pressed }) => [styles.socialButton, pressed && styles.pressed]}
    >
      <Text style={styles.socialButtonText}>{label}</Text>
    </Pressable>
  );
}

export default function SignInScreen(): React.JSX.Element {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn(): Promise<void> {
    if (!isLoaded || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(app)/dashboard');
      } else {
        setErrorMessage('Additional verification required to complete sign in.');
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
            id="sign-in-back-btn"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <ArcWordmark />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>

          {/* Social Auth */}
          <View style={styles.socialGroup}>
            <SocialButton label="Continue with Google" onPress={() => {}} />
            <SocialButton label="Continue with Apple" onPress={() => {}} />
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email + Password Inputs */}
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                id="sign-in-email-input"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor={C.textTertiary}
                style={styles.input}
                value={email}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                id="sign-in-password-input"
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={C.textTertiary}
                secureTextEntry={!showPassword}
                style={[styles.input, styles.inputWithTrailingAction]}
                value={password}
              />
              <Pressable
                id="sign-in-toggle-password-btn"
                onPress={() => setShowPassword((v) => !v)}
                style={styles.inputTrailingAction}
              >
                <Text style={styles.inputTrailingText}>{showPassword ? '🙈' : '👁'}</Text>
              </Pressable>
            </View>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Forgot Password */}
          <Pressable
            id="sign-in-forgot-password-btn"
            onPress={() => router.push('/(auth)/forgot-password' as any)}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </Pressable>

          {/* Sign In CTA */}
          <Pressable
            id="sign-in-submit-btn"
            disabled={isSubmitting || !email || !password}
            onPress={handleSignIn}
            style={({ pressed }) => [
              styles.primaryButton,
              (isSubmitting || !email || !password) && styles.primaryButtonDisabled,
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
                <Text style={styles.primaryButtonText}>Sign In</Text>
              )}
            </LinearGradient>
          </Pressable>

          {/* Sign Up Link */}
          <View style={styles.switchAuth}>
            <Text style={styles.switchAuthText}>{"Don't have an account? "}</Text>
            <Link href="/(auth)/sign-up" style={styles.switchAuthLink}>
              Sign Up
            </Link>
          </View>
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
  inputGroup: { gap: 12, marginBottom: 8 },
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
  inputWithTrailingAction: { paddingRight: 8 },
  inputTrailingAction: { padding: 8, marginRight: -8 },
  inputTrailingText: { fontSize: 16 },
  errorBanner: {
    backgroundColor: 'rgba(255,107,107,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, color: C.destructive, fontWeight: '500' },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20, paddingVertical: 4 },
  forgotPasswordText: { fontSize: 13, fontWeight: '600', color: C.brand },
  primaryButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: -0.16 },
  switchAuth: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchAuthText: { fontSize: 14, color: C.textSecondary },
  switchAuthLink: { fontSize: 14, fontWeight: '700', color: C.brand },
});
