import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createApiClient } from '../../../lib/api';
import { Droplets, Moon, Footprints, Dumbbell, Flame, ChevronRight, Check } from 'lucide-react-native';
import { ProgressRing } from '../../../../../packages/ui/src/ProgressRing';

import { useAppTheme } from '../../../lib/themeStore';

const INITIAL_HABITS = [
  { id: 1, name: "Drink Water", sub: "8 glasses / day", Icon: Droplets, color: "#06B6D4", done: true, streak: 8, target: "8 glasses", current: "8 glasses" },
  { id: 2, name: "Quality Sleep", sub: "8 hours goal", Icon: Moon, color: "#7C5CFC", done: true, streak: 14, target: "8h", current: "7h 45m" },
  { id: 3, name: "10k Steps", sub: "Daily movement", Icon: Footprints, color: "#FF6B6B", done: false, streak: 5, target: "10,000", current: "6,234" },
  { id: 4, name: "Workout", sub: "Scheduled training", Icon: Dumbbell, color: "#00D9B8", done: false, streak: 14, target: "Done", current: "Not yet" },
];

export default function HabitsScreen(): React.JSX.Element {
  const C = useAppTheme();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const queryClient = useQueryClient();

  const { data: habits = INITIAL_HABITS } = useQuery({
    queryKey: ['habits-detail'],
    queryFn: () => Promise.resolve(INITIAL_HABITS), // Mocking fetch for UI prototype
    staleTime: Infinity,
  });

  const { mutate: toggleHabit } = useMutation({
    mutationFn: async (habitId: number) => {
      const isDone = !habits.find(h => h.id === habitId)?.done;
      return api.logHabit({ habitId: String(habitId), completed: isDone }).catch(() => null);
    },
    onMutate: async (habitId: number) => {
      await queryClient.cancelQueries({ queryKey: ['habits-detail'] });
      await queryClient.cancelQueries({ queryKey: ['dashboard-habits'] });
      
      const prevDetail = queryClient.getQueryData<typeof INITIAL_HABITS>(['habits-detail']);
      const prevDashboard = queryClient.getQueryData<any[]>(['dashboard-habits']);

      queryClient.setQueryData(['habits-detail'], (old: typeof INITIAL_HABITS = INITIAL_HABITS) =>
        old.map((h) => (h.id === habitId ? { ...h, done: !h.done } : h))
      );
      
      queryClient.setQueryData(['dashboard-habits'], (old: any[] = []) =>
        old.map((h) => (h.id === habitId ? { ...h, done: !h.done } : h))
      );

      return { prevDetail, prevDashboard };
    },
    onError: (err, newHabit, context) => {
      if (context?.prevDetail) queryClient.setQueryData(['habits-detail'], context.prevDetail);
      if (context?.prevDashboard) queryClient.setQueryData(['dashboard-habits'], context.prevDashboard);
    },
  });

  const completed = habits.filter((h) => h.done).length;
  const pct = (completed / habits.length) * 100;

  const toggle = (id: number) => {
    toggleHabit(id);
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

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
                {completed === habits.length ? "All done! 🎉" : `${completed} of ${habits.length} done`}
              </Text>
              <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 4, lineHeight: 18 }}>
                {completed === habits.length ? "Consistency streak continuing" : `${habits.length - completed} habit${habits.length - completed > 1 ? "s" : ""} remaining today`}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }}>
                <Flame size={14} color="#FF6B6B" />
                <Text style={{ fontSize: 13, fontWeight: '700', color: "#FF6B6B" }}>14-day streak</Text>
                <Text style={{ fontSize: 12, color: C.textTertiary, fontWeight: '500' }}>· Personal best!</Text>
              </View>
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
                  {current} · target {target}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <Flame size={12} color="#FF6B6B" />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: "#FF6B6B" }}>{streak}d streak</Text>
                </View>
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
