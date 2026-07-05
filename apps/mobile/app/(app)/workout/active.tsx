import { useAuth } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createApiClient, type WorkoutDayDetail } from '../../../lib/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Appearance } from 'react-native';
import { LightColors, DarkColors } from '../../../../../packages/ui/src/tokens/theme';

const isDark = Appearance.getColorScheme() === 'dark';
const C = isDark ? DarkColors : LightColors;

type SetCompletionState = Record<string, boolean[]>;

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export default function WorkoutScreen(): React.JSX.Element {
  const { dayId, sessionId } = useLocalSearchParams<{ dayId: string, sessionId: string }>();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  
  const [setCompletion, setSetCompletion] = useState<SetCompletionState>({});
  const [startedAt] = useState(() => new Date().toISOString());
  
  const [isFinishing, setIsFinishing] = useState(false);
  
  const [elapsed, setElapsed] = useState(0);
  const [exIdx, setExIdx] = useState(0);

  const { data: workoutDay, isLoading, error } = useQuery({
    queryKey: ['workout-day-active', dayId],
    queryFn: () => api.getWorkoutDay(dayId as string),
    enabled: !!dayId,
  });

  const { mutate: logSetMutation } = useMutation({
    mutationFn: (args: { exerciseId: string; setNumber: number }) => 
      api.logSet({
        sessionId: sessionId as string,
        exerciseId: args.exerciseId,
        setNumber: args.setNumber,
      }),
  });

  const { mutateAsync: completeSessionMutation } = useMutation({
    mutationFn: () => api.completeSession({
      sessionId: sessionId as string,
      completedAt: new Date().toISOString(),
    })
  });

  useEffect(() => {
    if (workoutDay && Object.keys(setCompletion).length === 0) {
      const initialSets: SetCompletionState = {};
      workoutDay.exercises.forEach((ex) => {
        initialSets[ex.id] = Array(ex.sets ?? 0).fill(false);
      });
      setSetCompletion(initialSets);
    }
  }, [workoutDay]);

  // Elapsed Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);



  function toggleSet(exerciseId: string, setIndex: number, restSeconds: number | null): void {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSetCompletion((current) => {
      const currentSets = current[exerciseId] ?? [];
      const nextSets = [...currentSets];
      const wasOff = !nextSets[setIndex];
      nextSets[setIndex] = wasOff;
      
      if (wasOff && sessionId) {
        logSetMutation({
          exerciseId,
          setNumber: setIndex + 1,
        });
      }
      
      return { ...current, [exerciseId]: nextSets };
    });
  }

  async function finishWorkout(): Promise<void> {
    if (!workoutDay || isFinishing) return;
    setIsFinishing(true);

    try {
      if (sessionId) {
        await completeSessionMutation();
      }

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Workout logged', 'Your session has been saved.', [
        { text: 'View Summary', onPress: () => router.replace(`/(app)/workout/summary?dayId=${dayId}&elapsed=${elapsed}`) },
      ]);
    } catch (error) {
      Alert.alert(
        'Unable to finish workout',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setIsFinishing(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={C.brand} size="large" />
      </View>
    );
  }

  if (error || !workoutDay) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>⚠️</Text>
        <Text style={styles.emptyTitle}>Session unavailable</Text>
        <Text style={styles.emptyText}>{error ? String(error) : 'Unable to load this workout.'}</Text>
        <Pressable
          id="workout-error-back-btn"
          onPress={() => router.replace('/(app)/(tabs)/dashboard')}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Text style={styles.backBtnText}>Back to Dashboard</Text>
        </Pressable>
      </View>
    );
  }

  const allSets = Object.values(setCompletion).flat();
  const totalSets = allSets.length;
  const completedTotal = allSets.filter(Boolean).length;
  const overallPct = totalSets > 0 ? Math.round((completedTotal / totalSets) * 100) : 0;
  
  const currentExercise = workoutDay.exercises[exIdx];
  const isCurrentExerciseCompleted = currentExercise ? 
    Array.from({ length: currentExercise.sets ?? 0 }).every(
      (_, sIdx) => setCompletion[currentExercise.id]?.[sIdx]
    ) : false;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable
          hitSlop={12}
          id="workout-exit-btn"
          onPress={() => {
            Alert.alert('Cancel Workout', 'Are you sure you want to discard this session?', [
              { text: 'No, stay', style: 'cancel' },
              { text: 'Yes, discard', onPress: () => router.replace('/(app)/(tabs)/dashboard'), style: 'destructive' },
            ]);
          }}
          style={({ pressed }) => [styles.exitBtn, pressed && styles.pressed]}
        >
          <Text style={styles.exitBtnText}>✕</Text>
        </Pressable>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={['#7C5CFC', '#00D9B8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${overallPct}%` }]}
            />
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.progressText}>
              {exIdx + 1} / {workoutDay.exercises.length} exercises
            </Text>
            <Text style={styles.progressPct}>{overallPct}% complete</Text>
          </View>
        </View>

        <View style={styles.timerBadge}>
          <Text style={styles.timerIcon}>⏱</Text>
          <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
        </View>
      </View>



      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {currentExercise ? (
          <>
            {/* Exercise Navigation */}
            <View style={styles.exNav}>
              <Pressable
                hitSlop={12}
                id="workout-prev-ex-btn"
                onPress={() => setExIdx(Math.max(0, exIdx - 1))}
                disabled={exIdx === 0}
                style={({ pressed }) => [
                  styles.exNavBtn,
                  exIdx === 0 && styles.disabled,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.exNavText}>←</Text>
              </Pressable>
              
              <View style={styles.exTitleContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                  {isCurrentExerciseCompleted && <Text style={{ color: C.brand, fontSize: 18, fontWeight: '800' }}>✓</Text>}
                  <Text style={styles.exTitle}>{currentExercise.exerciseName}</Text>
                </View>
                <Text style={styles.exMeta}>
                  {currentExercise.sets} Sets · {currentExercise.reps}
                </Text>
              </View>

              <Pressable
                hitSlop={12}
                id="workout-next-ex-btn"
                onPress={() => setExIdx(Math.min(workoutDay.exercises.length - 1, exIdx + 1))}
                disabled={exIdx === workoutDay.exercises.length - 1}
                style={({ pressed }) => [
                  styles.exNavBtn,
                  exIdx === workoutDay.exercises.length - 1 && styles.disabled,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.exNavText}>→</Text>
              </Pressable>
            </View>

            {/* Set Headers */}
            <View style={styles.setHeaders}>
              <Text style={[styles.setHdrText, { width: 40 }]}>SET</Text>
              <Text style={[styles.setHdrText, { flex: 1, textAlign: 'center' }]}>REPS</Text>
              <Text style={[styles.setHdrText, { width: 44, textAlign: 'center' }]}>✓</Text>
            </View>

            {/* Sets */}
            {Array.from({ length: currentExercise.sets ?? 0 }).map((_, sIdx) => {
              const isChecked = setCompletion[currentExercise.id]?.[sIdx] ?? false;
              
              return (
                <View key={sIdx} style={[styles.setRow, isChecked && styles.setRowDone]}>
                  <View style={styles.setNumBox}>
                    <Text style={styles.setNum}>{sIdx + 1}</Text>
                  </View>
                  
                  <View style={styles.setMain}>
                    <Text style={[styles.setText, isChecked && styles.setTextDone]}>
                      {currentExercise.reps}
                    </Text>
                  </View>

                  <Pressable
                    id={`workout-toggle-set-${sIdx}-btn`}
                    onPress={() => toggleSet(currentExercise.id, sIdx, currentExercise.restSeconds)}
                    style={({ pressed }) => [
                      styles.checkBtn,
                      isChecked && styles.checkBtnDone,
                      pressed && styles.pressed,
                    ]}
                  >
                    {isChecked && <Text style={styles.checkIcon}>✓</Text>}
                  </Pressable>
                </View>
              );
            })}
          </>
        ) : null}

        {/* Next Exercise or Finish Button at bottom */}
        {exIdx < workoutDay.exercises.length - 1 && isCurrentExerciseCompleted && (
          <Pressable
            id="workout-next-ex-bottom-btn"
            onPress={() => setExIdx(exIdx + 1)}
            style={({ pressed }) => [
              styles.finishBtn,
              pressed && styles.pressed,
            ]}
          >
            <LinearGradient
              colors={['#7C5CFC', '#A07AF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.finishBtnGradient}
            >
              <Text style={styles.finishBtnText}>Next Exercise →</Text>
            </LinearGradient>
          </Pressable>
        )}
        
        {exIdx === workoutDay.exercises.length - 1 && (
          <Pressable
            id="workout-finish-btn"
            onPress={completedTotal === totalSets ? finishWorkout : undefined}
            style={({ pressed }) => [
              styles.finishBtn,
              (isFinishing || completedTotal !== totalSets) && styles.disabled,
              pressed && completedTotal === totalSets && styles.pressed,
            ]}
          >
            <LinearGradient
              colors={completedTotal !== totalSets ? ['#888', '#666'] : ['#8F6FFF', '#A07AF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.finishBtnGradient}
            >
              {isFinishing ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.finishBtnText}>
                  {completedTotal === totalSets ? 'Complete Workout ✨' : 'Complete all sets to finish'}
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  loading: { flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: C.foreground },
  emptyText: { fontSize: 15, color: C.textSecondary, textAlign: 'center' },
  backBtn: { backgroundColor: C.cardRaised, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginTop: 12 },
  backBtnText: { color: C.foreground, fontWeight: '600' },
  
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  exitBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.muted,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitBtnText: { color: C.foreground, fontSize: 16, fontWeight: '800' },
  progressContainer: { flex: 1 },
  progressBarBg: { height: 6, backgroundColor: C.muted, borderRadius: 99, overflow: 'hidden', marginBottom: 6 },
  progressBarFill: { height: '100%', borderRadius: 99 },
  progressStats: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 11, color: C.textTertiary, fontWeight: '600' },
  progressPct: { fontSize: 11, color: C.brand, fontWeight: '700' },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.muted,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timerIcon: { fontSize: 12 },
  timerText: { fontSize: 13, fontWeight: '700', color: C.foreground },
  


  content: { padding: 16, paddingBottom: 40 },
  exNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  exNavBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.cardRaised,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exNavText: { color: C.foreground, fontSize: 18, fontWeight: '700' },
  exTitleContainer: { flex: 1, alignItems: 'center' },
  exTitle: { fontSize: 18, fontWeight: '700', color: C.foreground, letterSpacing: -0.36, textAlign: 'center' },
  exMeta: { fontSize: 12, color: C.textTertiary, marginTop: 4 },
  
  setHeaders: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  setHdrText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.textTertiary,
    letterSpacing: 1,
  },
  
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  setRowDone: { backgroundColor: 'rgba(143,111,255,0.06)', borderColor: 'rgba(143,111,255,0.2)' },
  setNumBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  setNum: { fontSize: 14, fontWeight: '700', color: C.textSecondary },
  setMain: { flex: 1, alignItems: 'center' },
  setText: { fontSize: 18, fontWeight: '700', color: C.foreground },
  setTextDone: { color: C.brand },
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  checkBtnDone: { backgroundColor: C.brand, borderColor: C.brand },
  checkIcon: { fontSize: 16, color: '#FFF', fontWeight: '800' },
  
  finishBtn: { marginTop: 32, borderRadius: 16, overflow: 'hidden' },
  finishBtnGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  finishBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  
  pressed: { opacity: 0.8, transform: [{ scale: 0.95 }] },
  disabled: { opacity: 0.4 },
});
