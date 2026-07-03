import { useAuth } from '@clerk/clerk-expo';
import { onboardingSchema, type OnboardingInput } from '@arc/validations';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

import { createApiClient } from '../../lib/api';
import { useOnboardingStore } from '../../lib/store/onboardingStore';

// ── ARC Design Tokens ─────────────────────────────────────────────────────────
import { Appearance } from 'react-native';
import { LightColors, DarkColors } from '../../../../packages/ui/src/tokens/theme';

const isDark = Appearance.getColorScheme() === 'dark';
const C = isDark ? DarkColors : LightColors;

// ── Step Definitions ──────────────────────────────────────────────────────────
const STEP_TITLES = ['Profile', 'Metrics', 'Goals', 'Setup'] as const;

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
] satisfies Array<{ label: string; value: OnboardingInput['gender'] }>;

const GOAL_OPTIONS = [
  {
    label: 'Lose Fat',
    value: 'lose_fat',
    detail: 'Burn calories, build lean muscle, and achieve sustainable body recomposition',
    emoji: '🔥',
    color: C.energyDark,
  },
  {
    label: 'Build Muscle',
    value: 'build_muscle',
    detail: 'Maximize hypertrophy with science-backed progressive overload protocols',
    emoji: '💪',
    color: C.brand,
  },
  {
    label: 'Maintain',
    value: 'maintain',
    detail: 'Hold your weight and improve consistency and performance',
    emoji: '⚡',
    color: C.health,
  },
] satisfies Array<{ label: string; value: OnboardingInput['goal']; detail: string; emoji: string; color: string }>;

const EXPERIENCE_OPTIONS = [
  { label: 'Beginner', value: 'beginner', subtitle: '< 1 year', emoji: '🌱', color: C.health },
  { label: 'Intermediate', value: 'intermediate', subtitle: '1–3 years', emoji: '📈', color: C.brand },
  { label: 'Advanced', value: 'advanced', subtitle: '3+ years', emoji: '🏆', color: C.amber },
] satisfies Array<{ label: string; value: OnboardingInput['experienceLevel']; subtitle: string; emoji: string; color: string }>;

const ACTIVITY_OPTIONS = [
  { label: 'Sedentary', value: 'sedentary' },
  { label: 'Light', value: 'light' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Active', value: 'active' },
  { label: 'Very active', value: 'very_active' },
] satisfies Array<{ label: string; value: OnboardingInput['activityLevel'] }>;

const ENVIRONMENT_OPTIONS = [
  { label: 'Home', value: 'home', detail: 'Minimal setup, flexible sessions', emoji: '🏠' },
  { label: 'Gym', value: 'gym', detail: 'Machines, cables, and full weights', emoji: '🏋️' },
] satisfies Array<{ label: string; value: OnboardingInput['environment']; detail: string; emoji: string }>;

const EQUIPMENT_OPTIONS = ['dumbbells', 'barbell', 'bench', 'cables', 'machines', 'bands', 'kettlebell'];

// ── Utility ───────────────────────────────────────────────────────────────────

function parseNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getValidationMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

function getStepError(step: number, form: Partial<OnboardingInput>): string | null {
  if (step === 0 && (!form.age || !form.gender)) return 'Add your age and gender to continue.';
  if (step === 1 && (!form.weightKg || !form.heightCm)) return 'Add your body metrics to continue.';
  if (step === 2 && (!form.goal || !form.experienceLevel || !form.activityLevel || !form.workoutDaysPerWeek)) {
    return 'Choose your goal, experience, activity, and weekly training days.';
  }
  if (step === 3 && (!form.dietaryPreference || !form.environment)) {
    return 'Complete your dietary and environment preferences.';
  }
  return null;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <View style={progressStyles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            progressStyles.bar,
            i <= current ? progressStyles.barActive : progressStyles.barInactive,
          ]}
        />
      ))}
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 3, borderRadius: 99 },
  barActive: { backgroundColor: C.brand },
  barInactive: { backgroundColor: 'rgba(255,255,255,0.10)' },
});

function StepHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={stepHeaderStyles.container}>
      <Text style={stepHeaderStyles.stepLabel}>STEP {step} OF {STEP_TITLES.length}</Text>
      <Text style={stepHeaderStyles.title}>{title}</Text>
      <Text style={stepHeaderStyles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const stepHeaderStyles = StyleSheet.create({
  container: { marginBottom: 24 },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textTertiary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: C.foreground,
    letterSpacing: -0.52,
    lineHeight: 32,
    marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: C.textSecondary, lineHeight: 22 },
});

function SectionLabel({ label }: { label: string }) {
  return <Text style={sectionLabelStyles.label}>{label}</Text>;
}

const sectionLabelStyles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textTertiary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 16,
  },
});

function OptionChip<Value extends string | number>({
  label,
  value,
  selected,
  onPress,
}: {
  label: string;
  value: Value;
  selected: boolean;
  onPress: (v: Value) => void;
}) {
  return (
    <Pressable
      id={`onboarding-option-${String(value)}`}
      onPress={() => onPress(value)}
      style={({ pressed }) => [
        chipStyles.chip,
        selected && chipStyles.chipSelected,
        pressed && chipStyles.chipPressed,
      ]}
    >
      <Text style={[chipStyles.chipText, selected && chipStyles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: 'rgba(143, 111, 255, 0.12)',
    borderColor: C.brand,
  },
  chipPressed: { opacity: 0.85 },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textSecondary,
    textTransform: 'capitalize',
  },
  chipTextSelected: { color: C.brand, fontWeight: '700' },
});

function DetailCard<Value extends string>({
  label,
  value,
  detail,
  emoji,
  color,
  selected,
  onPress,
}: {
  label: string;
  value: Value;
  detail: string;
  emoji: string;
  color: string;
  selected: boolean;
  onPress: (v: Value) => void;
}) {
  return (
    <Pressable
      id={`onboarding-detail-${value}`}
      onPress={() => onPress(value)}
      style={({ pressed }) => [
        detailCardStyles.card,
        selected && { borderColor: color, backgroundColor: `${color}10` },
        pressed && detailCardStyles.pressed,
      ]}
    >
      <View style={[detailCardStyles.iconWrapper, { backgroundColor: selected ? `${color}20` : C.muted }]}>
        <Text style={detailCardStyles.emoji}>{emoji}</Text>
      </View>
      <View style={detailCardStyles.textWrapper}>
        <Text style={[detailCardStyles.label, selected && { color }]}>{label}</Text>
        <Text style={detailCardStyles.detail}>{detail}</Text>
      </View>
      <View style={[detailCardStyles.radio, selected && { backgroundColor: color, borderColor: color }]}>
        {selected && <Text style={detailCardStyles.radioCheck}>✓</Text>}
      </View>
    </Pressable>
  );
}

const detailCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    backgroundColor: C.card,
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 20,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: { fontSize: 24 },
  textWrapper: { flex: 1 },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: C.foreground,
    letterSpacing: -0.34,
    marginBottom: 4,
  },
  detail: { fontSize: 12, color: C.textSecondary, lineHeight: 18 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioCheck: { fontSize: 11, color: '#FFF', fontWeight: '800' },
});

function ExperienceCard({
  label,
  value,
  subtitle,
  emoji,
  color,
  selected,
  onPress,
}: {
  label: string;
  value: OnboardingInput['experienceLevel'];
  subtitle: string;
  emoji: string;
  color: string;
  selected: boolean;
  onPress: (v: OnboardingInput['experienceLevel']) => void;
}) {
  return (
    <Pressable
      id={`onboarding-experience-${value}`}
      onPress={() => onPress(value)}
      style={({ pressed }) => [
        expStyles.card,
        selected && { borderColor: color, backgroundColor: `${color}10` },
        pressed && expStyles.pressed,
      ]}
    >
      <View style={[expStyles.iconWrapper, { backgroundColor: selected ? `${color}25` : C.muted }]}>
        <Text style={expStyles.emoji}>{emoji}</Text>
      </View>
      <View style={expStyles.textWrapper}>
        <Text style={[expStyles.label, selected && { color }]}>{label}</Text>
        <Text style={expStyles.subtitle}>{subtitle}</Text>
      </View>
      <View style={[expStyles.radio, selected && { backgroundColor: color, borderColor: color }]}>
        {selected && <Text style={expStyles.radioCheck}>✓</Text>}
      </View>
    </Pressable>
  );
}

const expStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: C.card,
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 18,
  },
  pressed: { opacity: 0.9 },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: { fontSize: 22 },
  textWrapper: { flex: 1 },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: C.foreground,
    letterSpacing: -0.32,
    marginBottom: 2,
  },
  subtitle: { fontSize: 12, color: C.textTertiary, fontWeight: '500' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioCheck: { fontSize: 10, color: '#FFF', fontWeight: '800' },
});

function StyledInput({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  id,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'decimal-pad' | 'number-pad';
  id: string;
}) {
  return (
    <TextInput
      id={id}
      autoCapitalize="none"
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={C.textTertiary}
      style={styledInputStyles.input}
      value={value}
    />
  );
}

const styledInputStyles = StyleSheet.create({
  input: {
    backgroundColor: C.inputBackground,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    fontWeight: '600',
    color: C.foreground,
  },
});

// ── Main Onboarding Screen ────────────────────────────────────────────────────

export default function OnboardingScreen(): React.JSX.Element | null {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const { currentStep, form, nextStep, previousStep, reset, setField } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkProfile(): Promise<void> {
      if (!isLoaded || !isSignedIn) {
        setIsCheckingProfile(false);
        return;
      }

      try {
        const result = await api.getMe();
        if (isMounted && result.profileComplete) {
          router.replace('/(app)/(tabs)/dashboard');
        }
      } catch {
        if (isMounted) setIsCheckingProfile(false);
        return;
      }

      if (isMounted) setIsCheckingProfile(false);
    }

    void checkProfile();
    return () => { isMounted = false; };
  }, [api, isLoaded, isSignedIn]);

  if (!isLoaded || isCheckingProfile) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={C.brand} size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  function handleNext(): void {
    const message = getStepError(currentStep, form);
    if (message) {
      Alert.alert('Almost there', message);
      return;
    }
    nextStep();
  }

  async function handleSubmit(): Promise<void> {
    if (isSubmitting) return;

    const parsed = onboardingSchema.safeParse(form);
    if (!parsed.success) {
      Alert.alert('Check your details', parsed.error.issues[0]?.message ?? 'Please complete every field.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitOnboarding(parsed.data);
      reset();
      router.replace('/(app)/(tabs)/dashboard');
    } catch (error) {
      Alert.alert('Onboarding failed', getValidationMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLastStep = currentStep === STEP_TITLES.length - 1;
  const equipment = form.equipment ?? [];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Progress + Header */}
        <View style={styles.header}>
          <StepProgressBar current={currentStep} total={STEP_TITLES.length} />
          <View style={{ height: 20 }} />
          {currentStep === 0 && (
            <StepHeader step={1} title="What's your primary goal?" subtitle="We'll build your entire training and nutrition plan around this" />
          )}
          {currentStep === 1 && (
            <StepHeader step={2} title="Your experience level?" subtitle="This determines the complexity of your workout structure" />
          )}
          {currentStep === 2 && (
            <StepHeader step={3} title="Your body metrics" subtitle="Used to calculate your personalized nutrition targets" />
          )}
          {currentStep === 3 && (
            <StepHeader step={4} title="Training setup" subtitle="Choose where you train and what ARC can program" />
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Step 0: Goal Selection ── */}
          {currentStep === 0 && (
            <View style={styles.stepContainer}>
              <View style={styles.cardList}>
                {GOAL_OPTIONS.map(({ label, value, detail, emoji, color }) => (
                  <DetailCard
                    key={value}
                    label={label}
                    value={value}
                    detail={detail}
                    emoji={emoji}
                    color={color}
                    selected={form.goal === value}
                    onPress={(v) => setField('goal', v)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* ── Step 1: Experience Level ── */}
          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.cardList}>
                {EXPERIENCE_OPTIONS.map(({ label, value, subtitle, emoji, color }) => (
                  <ExperienceCard
                    key={value}
                    label={label}
                    value={value}
                    subtitle={subtitle}
                    emoji={emoji}
                    color={color}
                    selected={form.experienceLevel === value}
                    onPress={(v) => setField('experienceLevel', v)}
                  />
                ))}
              </View>

              <SectionLabel label="Activity Level" />
              <View style={styles.chipGrid}>
                {ACTIVITY_OPTIONS.map(({ label, value }) => (
                  <OptionChip
                    key={value}
                    label={label}
                    value={value}
                    selected={form.activityLevel === value}
                    onPress={(v) => setField('activityLevel', v)}
                  />
                ))}
              </View>

              <SectionLabel label="Workouts Per Week" />
              <View style={styles.chipGrid}>
                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                  <OptionChip
                    key={days}
                    label={String(days)}
                    value={days}
                    selected={form.workoutDaysPerWeek === days}
                    onPress={(v) => setField('workoutDaysPerWeek', v)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* ── Step 2: Body Metrics ── */}
          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              <SectionLabel label="Age" />
              <StyledInput
                id="onboarding-age-input"
                keyboardType="number-pad"
                onChangeText={(v) => setField('age', parseNumber(v) as OnboardingInput['age'])}
                placeholder="25"
                value={form.age ? String(form.age) : ''}
              />

              <SectionLabel label="Gender" />
              <View style={styles.chipGrid}>
                {GENDER_OPTIONS.map(({ label, value }) => (
                  <OptionChip
                    key={value}
                    label={label}
                    value={value}
                    selected={form.gender === value}
                    onPress={(v) => setField('gender', v)}
                  />
                ))}
              </View>

              <SectionLabel label="Weight (kg)" />
              <StyledInput
                id="onboarding-weight-input"
                keyboardType="decimal-pad"
                onChangeText={(v) => setField('weightKg', parseNumber(v) as OnboardingInput['weightKg'])}
                placeholder="75"
                value={form.weightKg ? String(form.weightKg) : ''}
              />

              <SectionLabel label="Height (cm)" />
              <StyledInput
                id="onboarding-height-input"
                keyboardType="decimal-pad"
                onChangeText={(v) => setField('heightCm', parseNumber(v) as OnboardingInput['heightCm'])}
                placeholder="175"
                value={form.heightCm ? String(form.heightCm) : ''}
              />
            </View>
          )}

          {/* ── Step 3: Training Setup ── */}
          {currentStep === 3 && (
            <View style={styles.stepContainer}>
              <SectionLabel label="Dietary Preference" />
              <StyledInput
                id="onboarding-dietary-input"
                onChangeText={(v) => setField('dietaryPreference', v)}
                placeholder="High protein, vegetarian, no preference…"
                value={form.dietaryPreference ?? ''}
              />

              <SectionLabel label="Training Environment" />
              <View style={styles.cardList}>
                {ENVIRONMENT_OPTIONS.map(({ label, value, detail, emoji }) => (
                  <DetailCard
                    key={value}
                    label={label}
                    value={value}
                    detail={detail}
                    emoji={emoji}
                    color={C.brand}
                    selected={form.environment === value}
                    onPress={(v) => setField('environment', v)}
                  />
                ))}
              </View>

              <SectionLabel label="Available Equipment" />
              <View style={styles.chipGrid}>
                {EQUIPMENT_OPTIONS.map((item) => {
                  const isSelected = equipment.includes(item);
                  return (
                    <Pressable
                      key={item}
                      id={`onboarding-equipment-${item}`}
                      onPress={() => {
                        setField(
                          'equipment',
                          isSelected
                            ? equipment.filter((e) => e !== item)
                            : [...equipment, item],
                        );
                      }}
                      style={({ pressed }) => [
                        chipStyles.chip,
                        isSelected && chipStyles.chipSelected,
                        pressed && chipStyles.chipPressed,
                      ]}
                    >
                      <Text style={[chipStyles.chipText, isSelected && chipStyles.chipTextSelected]}>
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <Pressable
            id="onboarding-back-btn"
            disabled={currentStep === 0 || isSubmitting}
            onPress={previousStep}
            style={({ pressed }) => [
              styles.backButton,
              (currentStep === 0 || isSubmitting) && styles.buttonDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          <Pressable
            id={isLastStep ? 'onboarding-submit-btn' : 'onboarding-continue-btn'}
            disabled={isSubmitting}
            onPress={isLastStep ? handleSubmit : handleNext}
            style={({ pressed }) => [
              styles.continueButton,
              isSubmitting && styles.buttonDisabled,
              pressed && styles.pressed,
            ]}
          >
            <LinearGradient
              colors={['#8F6FFF', '#A07AF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueButtonGradient}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.continueButtonText}>
                  {isLastStep ? 'Generate My Plan ✨' : 'Continue →'}
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  flex: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 4,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  stepContainer: {
    gap: 0,
  },
  cardList: { gap: 10 },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.background,
  },
  backButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.muted,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    flexShrink: 0,
  },
  backButtonText: { fontSize: 22, color: C.foreground },
  continueButton: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  continueButtonGradient: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.16 },
  buttonDisabled: { opacity: 0.4 },
  pressed: { opacity: 0.9 },
});
