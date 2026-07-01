import { useAuth, useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  createApiClient,
  type DashboardData,
  type DashboardNutrition,
  type DashboardWorkoutPlan,
} from '../../lib/api';
import { HabitTracker } from '../../components/dashboard/HabitTracker';

// ARC design tokens
import { Appearance } from 'react-native';
import { LightColors, DarkColors } from '../../../../packages/ui/src/tokens/theme';

const isDark = Appearance.getColorScheme() === 'dark';
const C = isDark ? DarkColors : LightColors;

function formatRest(restSeconds: number): string {
  if (restSeconds < 60) return `${restSeconds}s`;
  const minutes = Math.floor(restSeconds / 60);
  const seconds = restSeconds % 60;
  return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

// ── Nutrition Card ────────────────────────────────────────────────────────────

function MacroTile({
  label,
  value,
  color,
  letter,
}: {
  label: string;
  value: number;
  color: string;
  letter: string;
}) {
  return (
    <View style={macroStyles.tile}>
      <View style={[macroStyles.letterBadge, { backgroundColor: `${color}20` }]}>
        <Text style={[macroStyles.letterText, { color }]}>{letter}</Text>
      </View>
      <Text style={macroStyles.value}>{value}g</Text>
      <Text style={macroStyles.label}>{label}</Text>
    </View>
  );
}

const macroStyles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  letterBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  letterText: { fontSize: 14, fontWeight: '800' },
  value: { fontSize: 20, fontWeight: '900', color: C.foreground },
  label: { fontSize: 12, fontWeight: '600', color: C.textTertiary },
});

function NutritionCard({ nutrition }: { nutrition: DashboardNutrition }) {
  const macros = [
    { label: 'Protein', value: nutrition.proteinG ?? 0, color: C.energy, letter: 'P' },
    { label: 'Carbs', value: nutrition.carbsG ?? 0, color: C.brand, letter: 'C' },
    { label: 'Fat', value: nutrition.fatG ?? 0, color: C.amber, letter: 'F' },
  ];

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.cardHeader}>
        <View>
          <Text style={cardStyles.kicker}>NUTRITION TARGET</Text>
          <Text style={cardStyles.title}>Daily Macros</Text>
        </View>
        <View style={cardStyles.calorieBadge}>
          <Text style={cardStyles.calorieNumber}>{nutrition.caloriesTarget ?? 0}</Text>
          <Text style={cardStyles.calorieUnit}>kcal</Text>
        </View>
      </View>
      <View style={cardStyles.macroRow}>
        {macros.map((m) => (
          <MacroTile key={m.label} {...m} />
        ))}
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textTertiary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: { fontSize: 18, fontWeight: '700', color: C.foreground, letterSpacing: -0.36 },
  calorieBadge: {
    backgroundColor: 'rgba(255,195,51,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,195,51,0.20)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'flex-end',
    minWidth: 88,
  },
  calorieNumber: { fontSize: 22, fontWeight: '900', color: C.amber },
  calorieUnit: { fontSize: 11, fontWeight: '700', color: C.amber, opacity: 0.7 },
  macroRow: { flexDirection: 'row', gap: 8 },
});

// ── Workout Plan Card ─────────────────────────────────────────────────────────

function WorkoutDayCard({
  day,
  index,
}: {
  day: DashboardWorkoutPlan['days'][number];
  index: number;
}) {
  const visibleExercises = day.exercises.slice(0, 4);
  const remaining = day.exercises.length - visibleExercises.length;

  return (
    <View style={workoutStyles.dayBlock}>
      {/* Day header */}
      <View style={workoutStyles.dayHeader}>
        <View style={workoutStyles.dayTitleGroup}>
          <Text style={workoutStyles.dayNumber}>DAY {index + 1}</Text>
          <Text style={workoutStyles.dayName}>{day.name ?? 'Workout'}</Text>
        </View>
        <Pressable
          id={`dashboard-start-workout-${day.id}-btn`}
          onPress={() => router.push(`/workout/${day.id}`)}
          style={({ pressed }) => [workoutStyles.startButton, pressed && workoutStyles.startButtonPressed]}
        >
          <LinearGradient
            colors={['#8F6FFF', '#A07AF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={workoutStyles.startButtonGradient}
          >
            <Text style={workoutStyles.startButtonText}>Start ▶</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Exercise list */}
      {visibleExercises.map((exercise, idx) => (
        <View key={exercise.id} style={workoutStyles.exerciseRow}>
          <View style={workoutStyles.exerciseIndex}>
            <Text style={workoutStyles.exerciseIndexText}>{idx + 1}</Text>
          </View>
          <View style={workoutStyles.exerciseMain}>
            <Text style={workoutStyles.exerciseName}>{exercise.exerciseName}</Text>
            <Text style={workoutStyles.exerciseMeta}>
              {exercise.sets ?? '-'} × {exercise.reps ?? '-'}
              {exercise.restSeconds ? ` · ${formatRest(exercise.restSeconds)} rest` : ''}
            </Text>
          </View>
        </View>
      ))}

      {remaining > 0 && (
        <Text style={workoutStyles.moreText}>+{remaining} more exercises</Text>
      )}
    </View>
  );
}

const workoutStyles = StyleSheet.create({
  dayBlock: {
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  dayTitleGroup: { flex: 1 },
  dayNumber: { fontSize: 11, fontWeight: '700', color: C.brand, letterSpacing: 1, marginBottom: 3 },
  dayName: { fontSize: 17, fontWeight: '700', color: C.foreground, letterSpacing: -0.34 },
  startButton: { borderRadius: 12, overflow: 'hidden' },
  startButtonPressed: { opacity: 0.85 },
  startButtonGradient: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(143, 111, 255, 0.08)',
  },
  exerciseIndex: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(143, 111, 255, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  exerciseIndexText: { fontSize: 12, fontWeight: '800', color: C.brand },
  exerciseMain: { flex: 1 },
  exerciseName: { fontSize: 14, fontWeight: '700', color: C.foreground },
  exerciseMeta: { fontSize: 12, fontWeight: '500', color: C.textSecondary, marginTop: 2 },
  moreText: {
    fontSize: 12,
    color: C.brand,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});

function WorkoutPlanCard({ workoutPlan }: { workoutPlan: DashboardWorkoutPlan }) {
  return (
    <View style={planStyles.card}>
      <View style={planStyles.header}>
        <View style={planStyles.headerText}>
          <Text style={planStyles.kicker}>ACTIVE WORKOUT</Text>
          <Text style={planStyles.title}>
            {workoutPlan.name ?? `${workoutPlan.splitType ?? 'Training'} Plan`}
          </Text>
        </View>
        <View style={planStyles.splitPill}>
          <Text style={planStyles.splitPillText}>{workoutPlan.splitType ?? 'Plan'}</Text>
        </View>
      </View>
      {workoutPlan.days.map((day, index) => (
        <WorkoutDayCard key={day.id} day={day} index={index} />
      ))}
    </View>
  );
}

const planStyles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  headerText: { flex: 1 },
  kicker: { fontSize: 11, fontWeight: '700', color: C.textTertiary, letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 18, fontWeight: '700', color: C.foreground, letterSpacing: -0.36 },
  splitPill: {
    backgroundColor: 'rgba(0,237,208,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(0,237,208,0.20)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
  },
  splitPillText: { fontSize: 11, fontWeight: '700', color: C.health },
});

// ── Main Dashboard Screen ─────────────────────────────────────────────────────

export default function DashboardScreen(): React.JSX.Element {
  const { getToken } = useAuth();
  const { user } = useUser();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard(): Promise<void> {
      try {
        const result = await api.getDashboard();
        if (isMounted) {
          setDashboard(result);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to load your dashboard.',
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [api]);

  const firstName = user?.firstName ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={C.brand} size="large" />
        <Text style={styles.loadingText}>Loading your plan...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top']}>
        <View style={styles.stateContent}>
          <Text style={styles.stateIcon}>⚠️</Text>
          <Text style={styles.stateTitle}>Dashboard unavailable</Text>
          <Text style={styles.stateText}>{errorMessage}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasDashboardData = Boolean(dashboard?.nutrition && dashboard.workoutPlan);

  if (!hasDashboardData) {
    return (
      <SafeAreaView style={styles.emptyContainer} edges={['top']}>
        <View style={styles.stateContent}>
          <View style={styles.stateIconBox}>
            <Text style={{ fontSize: 36 }}>⚡</Text>
          </View>
          <Text style={styles.stateTitle}>Almost ready!</Text>
          <Text style={styles.stateText}>
            Finish your profile setup to generate your personalized nutrition and training plan.
          </Text>
          <Pressable
            id="dashboard-complete-setup-btn"
            onPress={() => router.replace('/onboarding')}
            style={({ pressed }) => [styles.setupButton, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={['#8F6FFF', '#A07AF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.setupButtonGradient}
            >
              <Text style={styles.setupButtonText}>Complete Profile Setup</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.name}>{firstName} 👋</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>Streak</Text>
            </View>
          </View>
          <Text style={styles.headerSub}>Your calories and training plan are ready.</Text>
        </View>

        {/* Cards */}
        <NutritionCard nutrition={dashboard!.nutrition!} />
        <HabitTracker />
        <WorkoutPlanCard workoutPlan={dashboard!.workoutPlan!} />

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  content: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.background,
    gap: 16,
  },
  loadingText: { fontSize: 15, color: C.textSecondary, fontWeight: '500' },
  errorContainer: { flex: 1, backgroundColor: C.background },
  emptyContainer: { flex: 1, backgroundColor: C.background },
  stateContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  stateIcon: { fontSize: 44 },
  stateIconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(143,111,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stateTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: C.foreground,
    letterSpacing: -0.52,
    textAlign: 'center',
  },
  stateText: { fontSize: 15, color: C.textSecondary, textAlign: 'center', lineHeight: 23 },
  setupButton: { borderRadius: 16, overflow: 'hidden', alignSelf: 'stretch', marginTop: 8 },
  setupButtonGradient: { paddingVertical: 16, alignItems: 'center' },
  setupButtonText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  pressed: { opacity: 0.85 },
  // Header
  header: { marginBottom: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  greeting: { fontSize: 14, color: C.textSecondary, fontWeight: '500', marginBottom: 2 },
  name: { fontSize: 26, fontWeight: '800', color: C.foreground, letterSpacing: -0.52 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,195,51,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,195,51,0.20)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  streakEmoji: { fontSize: 14 },
  streakText: { fontSize: 12, fontWeight: '700', color: '#FFC333' },
  headerSub: { fontSize: 14, color: C.textSecondary, lineHeight: 22 },
});
