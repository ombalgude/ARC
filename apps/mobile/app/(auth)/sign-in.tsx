import { useSignIn } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
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
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

// ARC dark-mode color palette
import { Appearance } from 'react-native';
import { LightColors, DarkColors } from '../../../../packages/ui/src/tokens/theme';

const isDark = Appearance.getColorScheme() === 'dark';
const C = isDark ? DarkColors : LightColors;

function getErrorMessage(error: unknown): string {
  // Clerk throws a ClerkAPIResponseError with an errors[] array.
  // The raw error.message is often unhelpful (e.g. "clerk_error").
  // We extract the first human-readable message from the array.
  if (
    error !== null &&
    typeof error === 'object' &&
    'errors' in error &&
    Array.isArray((error as { errors: unknown[] }).errors)
  ) {
    const clerkError = (error as { errors: { longMessage?: string; message?: string }[] }).errors.at(0);
    if (clerkError !== undefined) {
      return clerkError.longMessage ?? clerkError.message ?? 'Unable to sign in. Please try again.';
    }
  }
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

function SocialButton({ label, onPress, type }: { label: string; onPress: () => void; type: 'google' | 'apple' }) {
  const slug = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <Pressable
      id={`sign-in-${slug}-btn`}
      onPress={onPress}
      style={({ pressed }) => [styles.socialButton, pressed && styles.pressed]}
    >
      {type === 'google' ? (
        <Image 
          source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
          style={styles.socialIconImage}
        />
      ) : (
        <Ionicons name="logo-apple" size={20} color={C.textPrimary} style={styles.socialIcon} />
      )}
      <Text style={styles.socialButtonText}>{label}</Text>
    </Pressable>
  );
}

export default function SignInScreen(): React.JSX.Element {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const handleGoogleSignIn = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive: setOAuthActive } = await startGoogleFlow({
        redirectUrl: Linking.createURL('/(app)/dashboard', { scheme: 'arc' }),
      });
      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        router.replace('/(app)/(tabs)/dashboard');
      }
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    }
  }, [startGoogleFlow]);

  async function handleSignIn(): Promise<void> {
    if (!isLoaded || isSubmitting) return;
    // Bug fix: signIn is undefined before Clerk loads; guard explicitly.
    if (!signIn) {
      setErrorMessage('Authentication service is not ready. Please try again.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(app)/(tabs)/dashboard');
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
            <SocialButton label="Continue with Google" onPress={handleGoogleSignIn} type="google" />
            <SocialButton label="Continue with Apple" onPress={() => {}} type="apple" />
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
              <Ionicons name="mail-outline" size={20} color={C.textTertiary} style={styles.inputIconVector || styles.inputIconVector} />
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
              <Ionicons name="lock-closed-outline" size={20} color={C.textTertiary} style={styles.inputIconVector || styles.inputIconVector} />
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
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={C.textTertiary} />
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: C.cardRaised,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  socialIconImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: { fontSize: 14, fontWeight: '600', color: C.foreground },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 12, fontWeight: '600', color: C.textTertiary, letterSpacing: 0.5 },
  inputGroup: { gap: 12, marginBottom: 8 },
  inputIconVector: {
    marginRight: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.inputBackground,
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
