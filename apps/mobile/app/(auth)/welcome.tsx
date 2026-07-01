import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ARC Dark-mode colors (inline to avoid circular deps during bootstrap)
import { Appearance } from 'react-native';
import { LightColors, DarkColors } from '../../../../packages/ui/src/tokens/theme';

const isDark = Appearance.getColorScheme() === 'dark';
const C = isDark ? DarkColors : LightColors;

const FEATURES = [
  { icon: '⚡', label: 'AI Coaching' },
  { icon: '🏋️', label: 'Smart Workouts' },
  { icon: '✓', label: 'Habit Building' },
  { icon: '🥗', label: 'Nutrition Guide' },
] as const;

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
function FeaturePill({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.featurePill}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

export default function WelcomeScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Hero Section ── */}
        <LinearGradient
          colors={['#2A1770', '#4C2FD4', '#7C5CFC', '#9B7FFC']}
          locations={[0, 0.3, 0.65, 1]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.hero}
        >
          {/* Ambient orbs */}
          <View style={styles.orbTopRight} />
          <View style={styles.orbBottomLeft} />

          {/* ARC Logo */}
          <View style={styles.logoContainer}>
            <ArcWordmark />
          </View>

          {/* Hero Text Content */}
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>YOUR PERSONAL FITNESS COACH</Text>
            </View>

            <Text style={styles.heroTitle}>
              Train smart.{'\n'}
              <Text style={styles.heroTitleFaded}>Build your arc.</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              Personalized workouts, intelligent habits, and an AI coach that knows your goals.
            </Text>

            {/* Feature Pills */}
            <View style={styles.featurePills}>
              {FEATURES.map(({ icon, label }) => (
                <FeaturePill key={label} icon={icon} label={label} />
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* ── CTA Section ── */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to start?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands building their best shape. Free to start.
          </Text>

          <View style={styles.buttonGroup}>
            {/* Primary: Create Account */}
            <Pressable
              id="welcome-create-account-btn"
              onPress={() => router.push('/(auth)/sign-up')}
              style={({ pressed }) => [styles.primaryButtonWrapper, pressed && styles.pressed]}
            >
              <LinearGradient
                colors={['#7C5CFC', '#A07AF8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Create Free Account</Text>
              </LinearGradient>
            </Pressable>

            {/* Secondary: Sign In */}
            <Pressable
              id="welcome-signin-btn"
              onPress={() => router.push('/(auth)/sign-in')}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryButtonText}>I already have an account</Text>
            </Pressable>
          </View>

          <Text style={styles.legalText}>
            By continuing you agree to our{' '}
            <Text style={styles.legalLink}>Terms</Text>
            {' & '}
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Hero
  hero: {
    minHeight: 460,
    paddingTop: 56,
    paddingHorizontal: 28,
    paddingBottom: 44,
    overflow: 'hidden',
  },
  orbTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0,217,184,0.12)',
  },
  orbBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(124,92,252,0.20)',
  },
  logoContainer: {
    marginBottom: 32,
  },
  heroContent: {
    flex: 1,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 50,
    letterSpacing: -1.76,
    marginBottom: 16,
  },
  heroTitleFaded: {
    color: 'rgba(255,255,255,0.65)',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 26,
    maxWidth: 300,
  },
  featurePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 24,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featureIcon: {
    fontSize: 13,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.88)',
  },
  // CTA Section
  ctaSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    backgroundColor: C.background,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: C.foreground,
    letterSpacing: -0.44,
    marginBottom: 6,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: C.textSecondary,
    lineHeight: 22,
    marginBottom: 28,
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    paddingVertical: 17,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.16,
  },
  secondaryButton: {
    backgroundColor: C.muted,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: C.foreground,
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  legalText: {
    textAlign: 'center',
    fontSize: 12,
    color: C.textTertiary,
    lineHeight: 20,
  },
  legalLink: {
    color: C.brand,
    fontWeight: '600',
  },
});
