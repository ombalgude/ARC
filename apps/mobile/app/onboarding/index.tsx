import { useAuth } from "@clerk/clerk-expo";
import { onboardingSchema, type OnboardingInput } from "@arc/validations";
import { Redirect, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { createApiClient } from "../../lib/api";
import { useOnboardingStore } from "../../lib/store/onboardingStore";

const steps = ["Profile", "Metrics", "Goals", "Setup"] as const;

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
] satisfies Array<{ label: string; value: OnboardingInput["gender"] }>;

const goalOptions = [
  { label: "Lose fat", value: "lose_fat", detail: "Lean down while keeping strength" },
  { label: "Maintain", value: "maintain", detail: "Hold weight and improve consistency" },
  { label: "Build muscle", value: "build_muscle", detail: "Progressive strength and size" },
] satisfies Array<{ label: string; value: OnboardingInput["goal"]; detail: string }>;

const experienceOptions = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
] satisfies Array<{ label: string; value: OnboardingInput["experienceLevel"] }>;

const activityOptions = [
  { label: "Sedentary", value: "sedentary" },
  { label: "Light", value: "light" },
  { label: "Moderate", value: "moderate" },
  { label: "Active", value: "active" },
  { label: "Very active", value: "very_active" },
] satisfies Array<{ label: string; value: OnboardingInput["activityLevel"] }>;

const environmentOptions = [
  { label: "Home", value: "home", detail: "Minimal setup, flexible sessions" },
  { label: "Gym", value: "gym", detail: "Machines, cables, and full weights" },
] satisfies Array<{ label: string; value: OnboardingInput["environment"]; detail: string }>;

const equipmentOptions = ["dumbbells", "barbell", "bench", "cables", "machines", "bands", "kettlebell"];

function parseNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getValidationMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

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
          router.replace("/(app)/dashboard");
        }
      } catch {
        if (isMounted) {
          setIsCheckingProfile(false);
        }
        return;
      }

      if (isMounted) {
        setIsCheckingProfile(false);
      }
    }

    void checkProfile();

    return () => {
      isMounted = false;
    };
  }, [api, isLoaded, isSignedIn]);

  if (!isLoaded || isCheckingProfile) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#f2c46d" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  function handleNext(): void {
    const message = getStepError(currentStep, form);

    if (message) {
      Alert.alert("Almost there", message);
      return;
    }

    nextStep();
  }

  async function handleSubmit(): Promise<void> {
    if (isSubmitting) {
      return;
    }

    const parsed = onboardingSchema.safeParse(form);

    if (!parsed.success) {
      Alert.alert("Check your details", parsed.error.issues[0]?.message ?? "Please complete every field.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.submitOnboarding(parsed.data);
      reset();
      router.replace("/(app)/dashboard");
    } catch (error) {
      Alert.alert("Onboarding failed", getValidationMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ARC Fitness</Text>
        <Text style={styles.title}>Build your training profile</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((currentStep + 1) / steps.length) * 100}%` }]} />
        </View>
        <View style={styles.stepLabels}>
          {steps.map((step, index) => (
            <Text key={step} style={[styles.stepLabel, index === currentStep && styles.stepLabelActive]}>
              {step}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 0 ? (
          <View>
            <SectionTitle title="Demographics" subtitle="Used only to calculate accurate calorie targets." />
            <Text style={styles.label}>Age</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={(value) => setField("age", parseNumber(value) as OnboardingInput["age"])}
              placeholder="28"
              placeholderTextColor="#68707d"
              style={styles.input}
              value={form.age ? String(form.age) : ""}
            />
            <Text style={styles.label}>Gender</Text>
            <OptionGrid
              options={genderOptions}
              selectedValue={form.gender}
              onSelect={(value) => setField("gender", value)}
            />
          </View>
        ) : null}

        {currentStep === 1 ? (
          <View>
            <SectionTitle title="Body metrics" subtitle="Your baseline for nutrition and workout volume." />
            <Text style={styles.label}>Weight in kg</Text>
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={(value) => setField("weightKg", parseNumber(value) as OnboardingInput["weightKg"])}
              placeholder="75"
              placeholderTextColor="#68707d"
              style={styles.input}
              value={form.weightKg ? String(form.weightKg) : ""}
            />
            <Text style={styles.label}>Height in cm</Text>
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={(value) => setField("heightCm", parseNumber(value) as OnboardingInput["heightCm"])}
              placeholder="178"
              placeholderTextColor="#68707d"
              style={styles.input}
              value={form.heightCm ? String(form.heightCm) : ""}
            />
          </View>
        ) : null}

        {currentStep === 2 ? (
          <View>
            <SectionTitle title="Training intent" subtitle="ARC will generate the first plan from this signal." />
            <Text style={styles.label}>Primary goal</Text>
            <DetailGrid
              options={goalOptions}
              selectedValue={form.goal}
              onSelect={(value) => setField("goal", value)}
            />
            <Text style={styles.label}>Experience</Text>
            <OptionGrid
              options={experienceOptions}
              selectedValue={form.experienceLevel}
              onSelect={(value) => setField("experienceLevel", value)}
            />
            <Text style={styles.label}>Activity level</Text>
            <OptionGrid
              options={activityOptions}
              selectedValue={form.activityLevel}
              onSelect={(value) => setField("activityLevel", value)}
            />
            <Text style={styles.label}>Workout days per week</Text>
            <OptionGrid
              options={[1, 2, 3, 4, 5, 6, 7].map((value) => ({ label: String(value), value }))}
              selectedValue={form.workoutDaysPerWeek}
              onSelect={(value) => setField("workoutDaysPerWeek", value)}
            />
          </View>
        ) : null}

        {currentStep === 3 ? (
          <View>
            <SectionTitle title="Training setup" subtitle="Choose where you train and what ARC can program." />
            <Text style={styles.label}>Dietary preference</Text>
            <TextInput
              onChangeText={(value) => setField("dietaryPreference", value)}
              placeholder="High protein, vegetarian, no preference"
              placeholderTextColor="#68707d"
              style={styles.input}
              value={form.dietaryPreference ?? ""}
            />
            <Text style={styles.label}>Environment</Text>
            <DetailGrid
              options={environmentOptions}
              selectedValue={form.environment}
              onSelect={(value) => setField("environment", value)}
            />
            <Text style={styles.label}>Equipment</Text>
            <View style={styles.equipmentGrid}>
              {equipmentOptions.map((equipment) => {
                const selected = form.equipment?.includes(equipment) ?? false;

                return (
                  <Pressable
                    key={equipment}
                    onPress={() => {
                      const currentEquipment = form.equipment ?? [];
                      setField(
                        "equipment",
                        selected
                          ? currentEquipment.filter((item) => item !== equipment)
                          : [...currentEquipment, equipment],
                      );
                    }}
                    style={[styles.equipmentPill, selected && styles.cardSelected]}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {equipment}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={currentStep === 0 || isSubmitting}
          onPress={previousStep}
          style={[styles.secondaryButton, currentStep === 0 && styles.buttonDisabled]}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable
          disabled={isSubmitting}
          onPress={currentStep === steps.length - 1 ? handleSubmit : handleNext}
          style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#171717" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {currentStep === steps.length - 1 ? "Generate plan" : "Continue"}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function SectionTitle({ subtitle, title }: { subtitle: string; title: string }): React.JSX.Element {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionHeading}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function OptionGrid<Value extends string | number>({
  onSelect,
  options,
  selectedValue,
}: {
  onSelect: (value: Value) => void;
  options: Array<{ label: string; value: Value }>;
  selectedValue: Value | undefined;
}): React.JSX.Element {
  return (
    <View style={styles.optionGrid}>
      {options.map((option) => {
        const selected = option.value === selectedValue;

        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onSelect(option.value)}
            style={[styles.optionCard, selected && styles.cardSelected]}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function DetailGrid<Value extends string>({
  onSelect,
  options,
  selectedValue,
}: {
  onSelect: (value: Value) => void;
  options: Array<{ detail: string; label: string; value: Value }>;
  selectedValue: Value | undefined;
}): React.JSX.Element {
  return (
    <View style={styles.detailGrid}>
      {options.map((option) => {
        const selected = option.value === selectedValue;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={[styles.detailCard, selected && styles.cardSelected]}
          >
            <Text style={[styles.detailTitle, selected && styles.optionTextSelected]}>{option.label}</Text>
            <Text style={styles.detailText}>{option.detail}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function getStepError(step: number, form: Partial<OnboardingInput>): string | null {
  if (step === 0 && (!form.age || !form.gender)) {
    return "Add your age and gender to continue.";
  }

  if (step === 1 && (!form.weightKg || !form.heightCm)) {
    return "Add your body metrics to continue.";
  }

  if (
    step === 2 &&
    (!form.goal || !form.experienceLevel || !form.activityLevel || !form.workoutDaysPerWeek)
  ) {
    return "Choose your goal, experience, activity, and weekly training days.";
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111318",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111318",
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 18,
    paddingTop: 64,
  },
  eyebrow: {
    color: "#f2c46d",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
    marginBottom: 22,
  },
  progressTrack: {
    backgroundColor: "#252b35",
    borderRadius: 999,
    height: 6,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: "#f2c46d",
    height: 6,
  },
  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  stepLabel: {
    color: "#68707d",
    fontSize: 12,
    fontWeight: "700",
  },
  stepLabelActive: {
    color: "#ffffff",
  },
  content: {
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    marginBottom: 24,
  },
  sectionHeading: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: "#aeb4bf",
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    color: "#d7dce4",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#1a1f28",
    borderColor: "#303642",
    borderRadius: 8,
    borderWidth: 1,
    color: "#ffffff",
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionCard: {
    alignItems: "center",
    backgroundColor: "#1a1f28",
    borderColor: "#303642",
    borderRadius: 8,
    borderWidth: 1,
    minWidth: "30%",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  detailGrid: {
    gap: 12,
  },
  detailCard: {
    backgroundColor: "#1a1f28",
    borderColor: "#303642",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  cardSelected: {
    backgroundColor: "#2a2418",
    borderColor: "#f2c46d",
  },
  optionText: {
    color: "#d7dce4",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  optionTextSelected: {
    color: "#f2c46d",
  },
  detailTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  detailText: {
    color: "#aeb4bf",
    fontSize: 14,
    lineHeight: 20,
  },
  equipmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  equipmentPill: {
    backgroundColor: "#1a1f28",
    borderColor: "#303642",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  footer: {
    borderColor: "#252b35",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 24,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#f2c46d",
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    minHeight: 52,
  },
  primaryButtonText: {
    color: "#171717",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#303642",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.45,
  },
});
