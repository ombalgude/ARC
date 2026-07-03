import { useAuth, useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView
} from 'react-native';
import { Bell, Droplets, Moon, Footprints, Dumbbell, ChevronRight, Flame, Sparkles, Clock, Activity, Check, Utensils } from 'lucide-react-native';
import { ProgressRing } from '../../../../../packages/ui/src/ProgressRing';
import { StreakHeatmap } from '../../../components/dashboard/StreakHeatmap';
import { useAppTheme } from '../../../lib/themeStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createApiClient, DashboardData, HabitSummary } from '../../../lib/api';

const HABIT_CONFIG: Record<string, any> = {
  water: { name: "Water", Icon: Droplets, color: "#06B6D4" },
  sleep: { name: "Sleep", Icon: Moon, color: "#7C5CFC" },
  steps: { name: "Steps", Icon: Footprints, color: "#FF6B6B" },
  workout: { name: "Train", Icon: Dumbbell, color: "#00D9B8" },
  macros: { name: "Nutrition", Icon: Utensils, color: "#FFB300" },
};

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
    return (rawHabits || []).map(h => ({
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
      const isDone = !habits.find(h => h.id === habitId)?.done;
      return api.logHabit({ habitId, localDate, completed: isDone }).catch(() => null);
    },
    onMutate: async (habitId: string) => {
      await queryClient.cancelQueries({ queryKey: ['habits-detail'] });
      const previousHabits = queryClient.getQueryData<HabitSummary[]>(['habits-detail']);
      
      if (previousHabits) {
        queryClient.setQueryData<HabitSummary[]>(['habits-detail'], old => 
          (old || []).map((h) => (h.id === habitId ? { ...h, completedToday: !h.completedToday } : h))
        );
      }
      return { previousHabits };
    },
    onError: (err, newHabit, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits-detail'], context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits-detail', localDate] });
    }
  });

  const done = habits.filter((h) => h.done).length;
  const habitPct = habits.length > 0 ? (done / habits.length) * 100 : 0;

  const nutrition = dashboardData?.nutrition;
  const cal = { now: 0, target: nutrition?.caloriesTarget || 2000 };
  const calPct = Math.round((cal.now / cal.target) * 100);

  const macros = [
    { label: "Protein", current: 0, target: nutrition?.proteinG || 150, color: "#7C5CFC" },
    { label: "Carbs", current: 0, target: nutrition?.carbsG || 250, color: "#00D9B8" },
    { label: "Fats", current: 0, target: nutrition?.fatG || 65, color: "#FF6B6B" },
  ];

  const workoutPlan = dashboardData?.workoutPlan;
  const nextWorkoutDay = workoutPlan?.days[0]; 
  const totalSets = nextWorkoutDay ? nextWorkoutDay.exercises.reduce((acc, ex) => acc + (ex.sets || 0), 0) : 0;
  const estimatedTime = nextWorkoutDay ? Math.round(totalSets * 1.5 + nextWorkoutDay.exercises.reduce((a, e) => a + ((e.restSeconds || 60) * (e.sets || 0)) / 60, 0)) : 0;

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
              Morning, {firstName} 👋
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
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, backgroundColor: 'rgba(255,107,107,0.08)', borderWidth: 1, borderColor: 'rgba(255,107,107,0.18)' }}>
            <Flame size={16} color={C.energy} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.energy, marginLeft: 8 }}>{dashboardData?.globalStreak || 0}-day streak</Text>
            <Text style={{ fontSize: 12, color: C.textSecondary, marginLeft: 6 }}>Keep it going — you're on fire!</Text>
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
                    onPress={() => router.push({ pathname: '/workout/[dayId]', params: { dayId: nextWorkoutDay.id } } as any)}
                    style={({ pressed }) => [{
                      backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 9,
                      shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4
                    }, pressed && { transform: [{ scale: 0.95 }] }]}
                  >
                    <Text style={{ color: C.brand, fontSize: 13, fontWeight: '700' }}>Start  →</Text>
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
            {habits.slice(0, 4).map(({ id, name, icon: Icon, done: isDone, color, streak }) => (
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
                  <Icon size={22} color={isDone ? color : C.textTertiary} strokeWidth={isDone ? 2.5 : 1.8} />
                  {isDone && (
                    <View style={{
                      position: 'absolute', top: -2, right: -2, width: 17, height: 17, borderRadius: 8.5,
                      backgroundColor: color, borderWidth: 2, borderColor: C.background,
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Check size={10} color="#FFF" strokeWidth={3} />
                    </View>
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
          <Pressable
            onPress={() => router.push('/nutrition' as any)}
            style={({ pressed }) => [{
              backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 16,
              shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2
            }, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground, letterSpacing: -0.15 }}>Nutrition</Text>
                <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 4 }}>
                  {cal.now.toLocaleString()} / {cal.target.toLocaleString()} kcal  ·  {calPct}%
                </Text>
              </View>
              <ProgressRing size={48} strokeWidth={5} progress={calPct} color={C.health} trackColor="rgba(255,255,255,0.06)">
                <Text style={{ fontSize: 9, fontWeight: '700', color: C.foreground }}>{calPct}%</Text>
              </ProgressRing>
            </View>

            <View style={{ gap: 8 }}>
              {macros.map(({ label, current, target, color }) => (
                <View key={label}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: C.textSecondary }}>{label}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: C.foreground }}>
                      {current}g<Text style={{ color: C.textTertiary, fontWeight: '400' }}> / {target}g</Text>
                    </Text>
                  </View>
                  <View style={{ height: 4, backgroundColor: C.muted, borderRadius: 2 }}>
                    <View style={{ height: '100%', width: `${Math.min(100, (current / target) * 100)}%`, backgroundColor: color, borderRadius: 2 }} />
                  </View>
                </View>
              ))}
            </View>
          </Pressable>
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
