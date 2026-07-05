import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createApiClient, HabitSummary } from '../../../lib/api';
import { Droplets, Moon, Footprints, Dumbbell, Utensils, Flame, ChevronRight, Check } from 'lucide-react-native';
import { ProgressRing } from '../../../../../packages/ui/src/ProgressRing';

import { useAppTheme } from '../../../lib/themeStore';

const HABIT_CONFIG: Record<string, any> = {
  water: { name: "Drink Water", Icon: Droplets, color: "#06B6D4" },
  sleep: { name: "Quality Sleep", Icon: Moon, color: "#7C5CFC" },
  steps: { name: "10k Steps", Icon: Footprints, color: "#FF6B6B" },
  workout: { name: "Workout", Icon: Dumbbell, color: "#00D9B8" },
  macros: { name: "Nutrition", Icon: Utensils, color: "#FFB300" },
};

export default function HabitsScreen(): React.JSX.Element {
  const C = useAppTheme();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const queryClient = useQueryClient();

  const now = new Date();
  const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const { data: rawHabits, isLoading } = useQuery({
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
      ...h,
      ...(HABIT_CONFIG[h.type] || { name: h.type, Icon: Check, color: C.brand }),
      done: h.completedToday,
      current: h.todayValue,
      target: h.targetValue ? `${h.targetValue} ${h.unit || ''}` : 'Done',
      streak: h.streak,
    }));
  }, [rawHabits, C.brand]);

  const { mutate: toggleHabit } = useMutation({
    mutationFn: async (habitId: string) => {
      const isDone = !habits.find(h => h.id === habitId)?.done;
      return api.logHabit({ habitId, localDate, completed: isDone }).catch(() => null);
    },
    onMutate: async (habitId: string) => {
      await queryClient.cancelQueries({ queryKey: ['habits-detail', localDate] });
      await queryClient.cancelQueries({ queryKey: ['dashboard-habits', localDate] });
      
      const prevDetail = queryClient.getQueryData<HabitSummary[]>(['habits-detail', localDate]);
      const prevDashboard = queryClient.getQueryData<HabitSummary[]>(['dashboard-habits', localDate]);

      if (prevDetail) {
        queryClient.setQueryData<HabitSummary[]>(['habits-detail', localDate], old =>
          (old || []).map(h => h.id === habitId ? { ...h, completedToday: !h.completedToday } : h)
        );
      }
      
      return { prevDetail, prevDashboard };
    },
    onError: (err, newHabit, context) => {
      if (context?.prevDetail) queryClient.setQueryData(['habits-detail', localDate], context.prevDetail);
      if (context?.prevDashboard) queryClient.setQueryData(['dashboard-habits', localDate], context.prevDashboard);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits-detail', localDate] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-habits', localDate] });
    },
  });

  const completed = habits.filter((h) => h.done).length;
  const pct = habits.length > 0 ? (completed / habits.length) * 100 : 0;

  const toggle = (id: string) => toggleHabit(id);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={C.brand} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground, letterSpacing: -0.7 }}>
            Habits
          </Text>
          <Text style={{ fontSize: 13, color: C.textTertiary, marginTop: 4 }}>
            {today}
          </Text>
        </View>
        <Pressable hitSlop={12} onPress={() => router.push('/habits/history' as any)}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.brand }}>History</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        
        {/* Overall progress */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              padding: 20,
              backgroundColor: C.card,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: C.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <ProgressRing size={80} strokeWidth={7} progress={pct} color={C.brand} trackColor={C.muted}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: C.foreground }}>
                {completed}/{habits.length}
              </Text>
            </ProgressRing>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>
                {habits.length === 0 ? "No Habits Yet" : (completed === habits.length ? "All done! 🎉" : `${completed} of ${habits.length} done`)}
              </Text>
              <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 4, lineHeight: 18 }}>
                {habits.length === 0 ? "Add a habit to get started" : (completed === habits.length ? "Consistency streak continuing" : `${habits.length - completed} habit${habits.length - completed > 1 ? "s" : ""} remaining today`)}
              </Text>
            </View>
          </View>
        </View>

        {/* Habits list */}
        <View style={{ paddingHorizontal: 20, gap: 12, paddingBottom: 20 }}>
          {habits.map(({ id, name, Icon, color, done, streak, current, target }) => (
            <View
              key={id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                padding: 16,
                backgroundColor: done ? `${color}15` : C.card,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: done ? `${color}40` : C.border,
                shadowColor: done ? color : '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: done ? 0.15 : 0.03,
                shadowRadius: done ? 12 : 8,
                elevation: done ? 2 : 1,
              }}
            >
              {/* Icon */}
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: done ? color : C.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={24} color={done ? "#FFFFFF" : C.textTertiary} strokeWidth={done ? 2.5 : 2} />
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: done ? color : C.foreground }}>
                  {name}
                </Text>
                <Text style={{ fontSize: 13, color: done ? C.textSecondary : C.textTertiary, marginTop: 2 }}>
                  {current} · target {target} {streak > 0 ? `· 🔥 ${streak} day${streak > 1 ? 's' : ''}` : ''}
                </Text>
              </View>

              {/* Toggle */}
              <Pressable
                onPress={() => toggle(id)}
                style={({ pressed }) => [
                  {
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: done ? color : C.muted,
                    borderWidth: 2,
                    borderColor: done ? color : C.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  pressed && { transform: [{ scale: 0.85 }] }
                ]}
              >
                {done ? (
                  <Check size={20} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <Check size={20} color={C.textTertiary} strokeWidth={2.5} />
                )}
              </Pressable>
            </View>
          ))}
        </View>

        {/* AI entry */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <Pressable
            onPress={() => router.push('/chat' as any)}
            style={({ pressed }) => [
              {
                borderRadius: 16,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgba(124,92,252,0.14)',
              },
              pressed && { transform: [{ scale: 0.98 }] }
            ]}
          >
            <LinearGradient
              colors={['rgba(124,92,252,0.12)', 'rgba(0,217,184,0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 }}
            >
              <Text style={{ fontSize: 20 }}>✨</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.foreground }}>
                  Need habit coaching?
                </Text>
                <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 2 }}>
                  Ask Arc for personalized tips
                </Text>
              </View>
              <ChevronRight size={16} color={C.textTertiary} strokeWidth={2.5} />
            </LinearGradient>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
