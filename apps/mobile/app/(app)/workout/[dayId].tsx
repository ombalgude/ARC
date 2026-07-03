import { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useAppTheme } from '../../../lib/themeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createApiClient } from '../../../lib/api';

export default function WorkoutDayScreen() {
  const C = useAppTheme();
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const [expanded, setExpanded] = useState<string | null>(null);
  
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);

  const { data: day, isLoading, error } = useQuery({
    queryKey: ['workout-day', dayId],
    queryFn: () => api.getWorkoutDay(dayId as string),
    enabled: !!dayId,
  });

  const { mutate: startSession, isPending: isStarting } = useMutation({
    mutationFn: () => api.startSession({
      workoutDayId: dayId as string,
      startedAt: new Date().toISOString()
    }),
    onSuccess: (data) => {
      router.push({ pathname: '/workout/active', params: { dayId: dayId as string, sessionId: data.session.id } } as any);
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={C.brand} />
      </SafeAreaView>
    );
  }

  if (error || !day) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.textSecondary, fontSize: 16 }}>Unable to load workout day.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16, padding: 12, backgroundColor: C.card, borderRadius: 8 }}>
          <Text style={{ color: C.foreground, fontWeight: '600' }}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const totalSets = day.exercises.reduce((a, e) => a + (e.sets || 0), 0);
  const estimatedTime = Math.round(totalSets * 1.5 + day.exercises.reduce((a, e) => a + ((e.restSeconds || 60) * (e.sets || 0)) / 60, 0));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ChevronLeft size={24} color={C.foreground} />
        </Pressable>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>
          {day.name || 'Workout Day'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Meta chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 16 }}>
          {[
            { label: `~${estimatedTime} min`, bg: `${C.brand}15`, color: C.brand },
            { label: `${totalSets} sets`, bg: `${C.health}15`, color: C.health },
            { label: `${day.exercises.length} exercises`, bg: C.muted, color: C.textSecondary },
          ].map(({ label, bg, color }) => (
            <View key={label} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: bg }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color }}>{label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Progressive overload tip */}
        <View style={{ marginHorizontal: 20, marginBottom: 16, padding: 14, backgroundColor: `${C.brand}15`, borderRadius: 14, borderWidth: 1, borderColor: `${C.brand}30`, flexDirection: 'row', gap: 10 }}>
          <Info size={16} color={C.brand} style={{ marginTop: 2 }} />
          <Text style={{ flex: 1, fontSize: 13, color: C.brand, lineHeight: 20 }}>
            <Text style={{ fontWeight: '800' }}>Progressive overload: </Text>
            Aim to add 2.5kg or 1 extra rep vs last session.
          </Text>
        </View>

        {/* Exercise list */}
        <View style={{ paddingHorizontal: 20, gap: 12, marginBottom: 24 }}>
          {day.exercises.map((exercise, idx) => {
            const isOpen = expanded === exercise.id;
            return (
              <View key={exercise.id} style={{ backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
                <Pressable onPress={() => setExpanded(isOpen ? null : exercise.id)} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${C.brand}15`, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: C.brand }}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground, letterSpacing: -0.2 }}>{exercise.exerciseName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: C.brand }}>{exercise.sets} × {exercise.reps}</Text>
                      <Text style={{ fontSize: 12, color: C.textTertiary }}>⏱ {exercise.restSeconds}s</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
                      <ChevronDown size={18} color={C.textTertiary} />
                    </View>
                  </View>
                </Pressable>
                {isOpen && (
                  <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4, borderTopWidth: 1, borderTopColor: C.border }}>
                    {exercise.notes ? (
                      <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 8 }}>
                        Notes: <Text style={{ fontWeight: '500', color: C.foreground }}>{exercise.notes}</Text>
                      </Text>
                    ) : null}
                    <Text style={{ fontSize: 13, color: C.textTertiary, marginTop: 4 }}>
                      Rest: {exercise.restSeconds}s between sets
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Start CTA */}
        <View style={{ paddingHorizontal: 20 }}>
          <Pressable
            disabled={isStarting}
            onPress={() => startSession()}
            style={({ pressed }) => [{
              borderRadius: 16,
              overflow: 'hidden',
              shadowColor: C.brand,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 24,
              elevation: 8,
              opacity: isStarting ? 0.7 : 1,
            }, pressed && !isStarting && { transform: [{ scale: 0.98 }] }]}
          >
            <LinearGradient
              colors={['#7C5CFC', '#A07AF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {isStarting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={{ fontSize: 17, fontWeight: '800', color: '#FFF' }}>Start Workout</Text>
                  <ChevronRight size={20} color="#FFF" strokeWidth={2.5} />
                </>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
