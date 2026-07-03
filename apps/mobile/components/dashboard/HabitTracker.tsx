import { useAuth } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { createApiClient, type HabitSummary } from '../../lib/api';

import { Appearance } from 'react-native';
import { LightColors, DarkColors } from '../../../../packages/ui/src/tokens/theme';

const isDark = Appearance.getColorScheme() === 'dark';
const C = isDark ? DarkColors : LightColors;

function getHabitLogPayload(habit: HabitSummary, localDate: string) {
  if (habit.type === 'water') return { habitId: habit.id, localDate, value: 1 };
  if (habit.type === 'steps') return { habitId: habit.id, localDate, value: 1000 };
  if (habit.type === 'sleep') return { habitId: habit.id, localDate, value: 8, completed: true };
  return { habitId: habit.id, localDate, completed: true };
}

function getHabitName(habit: HabitSummary): string {
  const names = {
    workout: 'Workout',
    water: 'Water Intake',
    sleep: 'Sleep',
    steps: 'Step Goal',
    macros: 'Macros',
  };
  return names[habit.type];
}

function getHabitIcon(habit: HabitSummary): string {
  const icons = {
    workout: '💪',
    water: '💧',
    sleep: '😴',
    steps: '👟',
    macros: '🥗',
  };
  return icons[habit.type];
}

function getHabitButtonLabel(habit: HabitSummary): string {
  if (habit.type === 'sleep') return 'Done';
  return '+';
}

function getHabitProgress(habit: HabitSummary): string {
  const target = Number(habit.targetValue ?? 0);
  const unit = habit.unit ?? 'units';
  if (target > 0) return `${habit.todayValue}/${target} ${unit}`;
  return habit.completedToday ? 'Complete' : 'Not logged';
}

export function HabitTracker(): React.JSX.Element {
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  
  const [habits, setHabits] = useState<HabitSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingHabitId, setPendingHabitId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHabits = async () => {
    try {
      const now = new Date();
      const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const result = await api.getHabits(localDate);
      setHabits(result.habits);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load habits.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const now = new Date();
        const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const result = await api.getHabits(localDate);
        if (isMounted) {
          setHabits(result.habits);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) setErrorMessage(error instanceof Error ? error.message : 'Unable to load habits.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    void load();
    return () => { isMounted = false; };
  }, [api]);

  async function handleLogHabit(habit: HabitSummary): Promise<void> {
    if (!habit.completedToday) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPendingHabitId(habit.id);
    try {
      const now = new Date();
      const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      await api.logHabit(getHabitLogPayload(habit, localDate));
      await loadHabits();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update habit.');
    } finally {
      setPendingHabitId(null);
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerText}>
          <Text style={styles.kicker}>DAILY HABITS</Text>
          <Text style={styles.title}>Recovery Basics</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>
            {habits.filter((h) => h.completedToday).length}/{habits.length}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={C.health} />
          <Text style={styles.loadingText}>Loading habits...</Text>
        </View>
      ) : (
        <View style={styles.habitList}>
          {habits.map((habit) => {
            const progress = getHabitProgress(habit);
            const isPending = pendingHabitId === habit.id;

            return (
              <View key={habit.id} style={styles.habitRow}>
                <View style={styles.iconBox}>
                  <Text style={styles.icon}>{getHabitIcon(habit)}</Text>
                </View>
                <View style={styles.habitMain}>
                  <Text style={styles.habitName}>{getHabitName(habit)}</Text>
                  <Text style={styles.habitMeta}>{progress}</Text>
                </View>
                <Pressable
                  disabled={isPending}
                  onPress={() => void handleLogHabit(habit)}
                  style={({ pressed }) => [
                    styles.habitBtn,
                    habit.completedToday && styles.habitBtnDone,
                    pressed && styles.pressed,
                    isPending && styles.habitBtnPending,
                  ]}
                >
                  {isPending ? (
                    <ActivityIndicator size="small" color={habit.completedToday ? C.health : C.foreground} />
                  ) : (
                    <Text style={[styles.habitBtnText, habit.completedToday && styles.habitBtnTextDone]}>
                      {habit.completedToday ? '✓' : getHabitButtonLabel(habit)}
                    </Text>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
  headerText: { flex: 1 },
  kicker: { fontSize: 11, fontWeight: '700', color: C.textTertiary, letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 18, fontWeight: '700', color: C.foreground, letterSpacing: -0.36 },
  headerBadge: {
    backgroundColor: 'rgba(0,237,208,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(0,237,208,0.20)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
  },
  headerBadgeText: { fontSize: 11, fontWeight: '700', color: C.health },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  loadingText: { fontSize: 14, color: C.textSecondary, fontWeight: '600' },
  habitList: { gap: 10 },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 18 },
  habitMain: { flex: 1 },
  habitName: { fontSize: 15, fontWeight: '700', color: C.foreground, letterSpacing: -0.3 },
  habitMeta: { fontSize: 12, fontWeight: '500', color: C.textSecondary, marginTop: 2 },
  habitBtn: {
    minWidth: 44,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 12,
  },
  habitBtnDone: { backgroundColor: 'rgba(0,237,208,0.12)', borderColor: C.health },
  habitBtnPending: { opacity: 0.6 },
  habitBtnText: { fontSize: 16, fontWeight: '700', color: C.foreground },
  habitBtnTextDone: { color: C.health, fontSize: 14 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.95 }] },
  errorText: { fontSize: 13, color: C.energy, marginTop: 12, textAlign: 'center' },
});
