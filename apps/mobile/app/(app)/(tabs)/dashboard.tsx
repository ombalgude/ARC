import { useAuth, useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Flame, ChevronRight, Activity, Check, CheckCircle2, Dumbbell, Calendar, Coffee, Utensils, Droplets, Moon, Footprints, Sparkles, Clock } from 'lucide-react-native';
import { ProgressRing } from '../../../../../packages/ui/src/ProgressRing';
import { StreakHeatmap } from '../../../components/dashboard/StreakHeatmap';
import { useAppTheme } from '../../../lib/themeStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createApiClient, DashboardData, HabitSummary } from '../../../lib/api';

const HABIT_CONFIG: Record<string, { name: string, Icon: any, color: string }> = {
  workout: { name: "Workout", Icon: Dumbbell, color: "#7C5CFC" },
  water: { name: "Water", Icon: Activity, color: "#00D9B8" },
  sleep: { name: "Sleep", Icon: Flame, color: "#FFB300" },
  macros: { name: "Macros", Icon: Activity, color: "#FF6B6B" },
};

function MacroBar({ label, current, target, color }: { label: string, current: number, target: number, color: string }) {
  const C = useAppTheme();
  const pct = target > 0 ? Math.min(1, current / target) : 0;
  
  const widthAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: pct * 100,
      tension: 60,
      friction: 10,
      useNativeDriver: false
    }).start();
  }, [pct]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: C.foreground }}>{label}</Text>
          {current >= target && target > 0 && <Check size={14} color={color} strokeWidth={3} />}
        </View>
        <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>
          <Text style={{ color: C.foreground }}>{current}g</Text> / {target}g
        </Text>
      </View>
      <View style={{ height: 6, backgroundColor: C.muted, borderRadius: 3, overflow: 'hidden' }}>
        <Animated.View style={[{ position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: color, borderRadius: 3, width: animatedWidth }]} />
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const C = useAppTheme();
  const { user } = useUser();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const queryClient = useQueryClient();
  
  const firstName = user?.firstName ?? 'Alex';

  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  });

  const now = new Date();
  const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const { data: rawHabits, isLoading: isLoadingHabits } = useQuery({
    queryKey: ['habits-detail', localDate],
    queryFn: () => api.getHabits(localDate).then(res => res.habits),
  });

  const habits = useMemo(() => {
    const safeHabitsArray = Array.isArray(rawHabits) 
      ? rawHabits 
      : (rawHabits && typeof rawHabits === 'object' && 'habits' in rawHabits ? (rawHabits as any).habits : []);
      
    return safeHabitsArray
      .filter((h: any) => !['macros', 'protein', 'carbs', 'fats', 'micros', 'meal_breakfast', 'meal_lunch', 'meal_preworkout', 'meal_postworkout'].includes(h.type))
      .map((h: any) => ({
        id: h.id,
        name: (HABIT_CONFIG[h.type] || {}).name || h.type,
        icon: (HABIT_CONFIG[h.type] || {}).Icon || Check,
        done: h.completedToday,
        color: (HABIT_CONFIG[h.type] || {}).color || C.brand,
        streak: h.streak,
      }));
  }, [rawHabits, C.brand]);

  const { mutate: toggleHabit } = useMutation({
    mutationFn: async (habitId: string) => {
      const habit = rawHabitsArray.find((h: any) => h.id === habitId);
      const isDone = !(habit?.completedToday ?? false);
      return api.logHabit({ habitId, localDate, completed: isDone }).catch(() => null);
    },
    onMutate: async (habitId: string) => {
      await queryClient.cancelQueries({ queryKey: ['habits-detail', localDate] });
      const previousHabits = queryClient.getQueryData<HabitSummary[]>(['habits-detail', localDate]);
      
      if (previousHabits) {
        queryClient.setQueryData<HabitSummary[]>(['habits-detail', localDate], old => 
          (old || []).map((h) => (h.id === habitId ? { ...h, completedToday: !h.completedToday } : h))
        );
      }
      return { previousHabits };
    },
    onError: (err, newHabit, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits-detail', localDate], context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits-detail', localDate] });
    }
  });

  const done = habits.filter((h: any) => h.done).length;
  const habitPct = habits.length > 0 ? (done / habits.length) * 100 : 0;

  const nutrition = dashboardData?.nutrition;
  const cal = { now: 0, target: nutrition?.caloriesTarget || 0 };
  const calPct = 0;

  const rawHabitsArray = Array.isArray(rawHabits) ? rawHabits : (rawHabits as any)?.habits || [];
  
  const workoutPlan = dashboardData?.workoutPlan;
  const currentDayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday...
  const nextWorkoutDay = workoutPlan?.days?.find(d => d.dayOfWeek === currentDayOfWeek || d.dayOfWeek === (currentDayOfWeek === 0 ? 7 : currentDayOfWeek));
  const totalSets = nextWorkoutDay ? nextWorkoutDay.exercises.reduce((acc, ex) => acc + (ex.sets || 0), 0) : 0;
  const estimatedTime = nextWorkoutDay ? Math.round(totalSets * 1.5 + nextWorkoutDay.exercises.reduce((a, e) => a + ((e.restSeconds || 60) * (e.sets || 0)) / 60, 0)) : 0;

  const getMacroHabit = (type: string) => rawHabitsArray.find((h: any) => h.type === type);

  const macrosList = [
    { label: "Protein", current: nutrition?.currentProtein || 0, target: nutrition?.proteinG || 0, color: "#7C5CFC" },
    { label: "Carbs", current: nutrition?.currentCarbs || 0, target: nutrition?.carbsG || 0, color: "#00D9B8" },
    { label: "Fats", current: nutrition?.currentFats || 0, target: nutrition?.fatG || 0, color: "#FF6B6B" },
  ];

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  if (isLoadingDashboard || isLoadingHabits) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={C.brand} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24, minHeight: '100%' }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 }}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.textTertiary, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 3 }}>
              {todayStr}
            </Text>
            <Text style={{ fontSize: 23, fontWeight: '700', color: C.foreground, letterSpacing: -0.6, lineHeight: 28 }}>
              Hey, {firstName} 👋
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Pressable hitSlop={12} style={({ pressed }) => [{
              width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 16,
              backgroundColor: C.muted, borderWidth: 1, borderColor: C.border,
            }, pressed && { transform: [{ scale: 0.95 }] }]}>
              <Bell size={17} color={C.foreground} strokeWidth={2} />
              <View style={{ position: 'absolute', top: 9, right: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: C.energy, borderWidth: 1.5, borderColor: C.background }} />
            </Pressable>
            <View style={{
              width: 40, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
              borderWidth: 2, borderColor: C.brand,
              ...Shadows.brand,
            }}>
              <LinearGradient colors={['#7C5CFC', '#00D9B8']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={{...StyleSheet.absoluteFillObject, borderRadius: 14}} />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFF' }}>{firstName[0]?.toUpperCase() ?? 'A'}</Text>
            </View>
          </View>
        </View>

        {/* Heatmap */}
        {dashboardData?.activityHistory && (
          <StreakHeatmap activityHistory={dashboardData.activityHistory} />
        )}

        {/* Streak */}
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: 'rgba(255,107,107,0.1)', borderWidth: 1, borderColor: 'rgba(255,107,107,0.15)', alignSelf: 'flex-start' }}>
            <Flame size={14} color={C.energy} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.energy, marginLeft: 6 }}>{dashboardData?.globalStreak || 0}-day streak</Text>
            <Text style={{ fontSize: 10, color: C.textSecondary, marginLeft: 6 }}>Keep it going!</Text>
          </View>
        </View>

        {/* Today's Workout Hero */}
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <View style={{
            borderRadius: 22, padding: 20, overflow: 'hidden',
            backgroundColor: '#7C5CFC',
            shadowColor: '#7C5CFC', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.40, shadowRadius: 40, elevation: 12
          }}>
            <LinearGradient colors={['#3A20C0', '#7C5CFC', '#9B7FFC']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={{...StyleSheet.absoluteFillObject}} />
            
            <View style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.07)', opacity: 0.8 }} />

            <View style={{ position: 'relative', zIndex: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.health, shadowColor: C.health, shadowOpacity: 1, shadowRadius: 8, elevation: 4 }} />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase' }}>Today's Session</Text>
                </View>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>Active Plan</Text>
              </View>

              <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.7, marginBottom: 5 }}>
                {nextWorkoutDay ? nextWorkoutDay.name || "Workout" : "Rest Day"}
              </Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 18 }}>
                {nextWorkoutDay ? `${nextWorkoutDay.exercises.length} exercises` : "Take it easy and recover."}
              </Text>

              {nextWorkoutDay && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} color="rgba(255,255,255,0.75)" />
                      <Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.75)' }}>~{estimatedTime} min</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Activity size={14} color="rgba(255,255,255,0.75)" />
                      <Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.75)' }}>{totalSets} sets</Text>
                    </View>
                  </View>
                  <Pressable
                    hitSlop={12}
                    disabled={dashboardData?.isWorkoutDoneToday}
                    onPress={() => router.push(`/workout/${nextWorkoutDay.id}` as any)}
                    style={({ pressed }) => [{
                      backgroundColor: dashboardData?.isWorkoutDoneToday ? 'rgba(255,255,255,0.2)' : '#FFFFFF', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 9,
                      shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4
                    }, pressed && !dashboardData?.isWorkoutDoneToday && { transform: [{ scale: 0.95 }] }]}
                  >
                    <Text style={{ color: dashboardData?.isWorkoutDoneToday ? 'rgba(255,255,255,0.7)' : C.brand, fontSize: 13, fontWeight: '700' }}>
                      {dashboardData?.isWorkoutDoneToday ? 'Completed ✓' : 'Start  →'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Habits */}
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.foreground }}>Habits</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, backgroundColor: C.brandLight, borderWidth: 1, borderColor: 'rgba(124,92,252,0.2)' }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: C.brand }}>{done}/{habits.length}</Text>
              </View>
            </View>
            <Pressable hitSlop={12} onPress={() => router.push('/habits' as any)}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: C.brand }}>All habits →</Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {habits.slice(0, 5).map(({ id, name, icon: Icon, done: isDone, color, streak }: any) => (
              <View key={id} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
                <Pressable
                  onPress={() => toggleHabit(id)}
                  style={({ pressed }) => [{
                    width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isDone ? `${color}18` : C.card,
                    borderWidth: 2, borderColor: isDone ? color : C.border,
                    shadowColor: isDone ? color : '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDone ? 0.3 : 0.05, shadowRadius: 16, elevation: isDone ? 8 : 2
                  }, pressed && { transform: [{ scale: 0.85 }] }]}
                >
                  {isDone && (
                    <Check size={28} color={color} strokeWidth={3} />
                  )}
                </Pressable>
                <Text style={{ fontSize: 10, fontWeight: '600', color: isDone ? C.foreground : C.textTertiary, letterSpacing: 0.2 }}>{name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Flame size={10} color={C.energy} />
                  <Text style={{ fontSize: 9, color: C.energy, fontWeight: '700' }}>{streak}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Nutrition Snapshot */}
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <View style={{ backgroundColor: C.card, borderRadius: 22, borderWidth: 1, borderColor: C.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 3 }}>
            <Pressable
              onPress={() => router.push('/nutrition' as any)}
              style={({ pressed }) => [pressed && { backgroundColor: 'rgba(0,0,0,0.02)' }]}
            >
            <View style={{ padding: 18, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: C.foreground, letterSpacing: -0.2 }}>Diet</Text>
                  <View style={{ paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'rgba(0,217,184,0.1)', borderRadius: 6 }}>
                    <Text style={{ fontSize: 9, fontWeight: '700', color: '#00D9B8' }}>{nutrition?.caloriesTarget || 0} kcal</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: C.textSecondary, fontWeight: '500' }}>
                  Track your daily nutrition goals
                </Text>
              </View>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: `${C.brand}15`, alignItems: 'center', justifyContent: 'center' }}>
                <Utensils size={20} color={C.brand} />
              </View>
            </View>

            <View style={{ padding: 18, gap: 14 }}>
              {macrosList.map((macro) => (
                <MacroBar key={macro.label} {...macro} />
              ))}
            </View>
          </Pressable>
            
            {/* Quick Actions for Meals */}
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.border, backgroundColor: 'rgba(0,0,0,0.01)' }}>
              {[
                { type: 'meal_breakfast', label: 'Breakfast', icon: Coffee },
                { type: 'meal_lunch', label: 'Lunch', icon: Utensils },
                { type: 'meal_preworkout', label: 'Pre-W', icon: Flame },
                { type: 'meal_postworkout', label: 'Post-W', icon: Dumbbell }
              ].map(({ type, label, icon: Icon }) => {
                const habit = getMacroHabit(type);
                const isDone = habit?.completedToday ?? false;
                
                return (
                  <Pressable
                    key={type}
                    onPress={() => habit?.id && toggleHabit(habit.id)}
                    style={({ pressed }) => [{
                      flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
                      borderRightWidth: type !== 'meal_postworkout' ? 1 : 0, borderRightColor: C.border,
                      backgroundColor: isDone ? 'rgba(0,217,184,0.1)' : 'transparent',
                    }, pressed && { opacity: 0.7 }]}
                  >
                    <Icon size={16} color={isDone ? '#00D9B8' : C.textTertiary} style={{ marginBottom: 4 }} />
                    <Text style={{ fontSize: 10, fontWeight: '700', color: isDone ? '#00D9B8' : C.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Arc AI Entry */}
        <View style={{ paddingHorizontal: 20 }}>
          <Pressable
            hitSlop={8}
            onPress={() => router.push('/chat' as any)}
            style={({ pressed }) => [{
              borderRadius: 18, borderWidth: 1, borderColor: 'rgba(124,92,252,0.15)', overflow: 'hidden'
            }, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <LinearGradient colors={['rgba(124,92,252,0.08)', 'rgba(0,217,184,0.06)']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={{ paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 42, height: 42, borderRadius: 14, shadowColor: '#7C5CFC', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.40, shadowRadius: 24, elevation: 8 }}>
                <LinearGradient colors={['#7C5CFC', '#A07AF8']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={{...StyleSheet.absoluteFillObject, borderRadius: 14, alignItems: 'center', justifyContent: 'center'}}>
                  <Sparkles size={18} color="#FFFFFF" strokeWidth={2} />
                </LinearGradient>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.foreground, letterSpacing: -0.15 }}>Ask Arc anything</Text>
                <Text style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>Your AI coach is ready</Text>
              </View>
              <ChevronRight size={16} color={C.textTertiary} />
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Shadows = {
  brand: {
    shadowColor: '#8F6FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 24,
    elevation: 8,
  }
};
