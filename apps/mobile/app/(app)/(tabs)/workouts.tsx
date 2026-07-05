import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Circle, Clock, ChevronRight, TrendingUp, Calendar, Dumbbell, Flame, Timer } from 'lucide-react-native';

import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { createApiClient } from '../../../lib/api';
import { useAppTheme } from '../../../lib/themeStore';



export default function WorkoutsScreen() {
  const C = useAppTheme();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => api.getSessions(),
  });

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.getMe(),
  });

  const currentDayOfWeek = new Date().getDay();
  const nextWorkoutDay = dashboardData?.workoutPlan?.days?.find(d => d.dayOfWeek === currentDayOfWeek || d.dayOfWeek === (currentDayOfWeek === 0 ? 7 : currentDayOfWeek));
  const workoutDayId = nextWorkoutDay?.id;

  const weekOrder = [1, 2, 3, 4, 5, 6, 0];
  const todayIndex = weekOrder.indexOf(currentDayOfWeek);
  
  const accountCreatedAt = me?.user?.createdAt ? new Date(me.user.createdAt) : new Date();
  accountCreatedAt.setHours(0,0,0,0);

  const getWeekDate = (d: number) => {
     const targetIndex = weekOrder.indexOf(d);
     const diff = targetIndex - todayIndex;
     const date = new Date();
     date.setDate(date.getDate() + diff);
     return date.getDate();
  };

  const handleStartWorkout = () => {
    if (workoutDayId) {
      router.push(`/workout/${workoutDayId}` as any);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground, letterSpacing: -0.7 }}>
              Workouts
            </Text>
            <Pressable hitSlop={12} onPress={() => router.push('/history' as any)}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.brand }}>History</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 13, color: C.textSecondary, fontWeight: '500' }}>
            {dashboardData?.workoutPlan?.days?.length ? `${dashboardData.workoutPlan.days.length}-Day Split • ` : ''}{dashboardData?.workoutPlan?.name || "My Plan"}
          </Text>
        </View>

        {/* Streak */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: 'rgba(255,107,107,0.1)', borderWidth: 1, borderColor: 'rgba(255,107,107,0.15)', alignSelf: 'flex-start' }}>
            <Flame size={14} color={C.energy} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.energy, marginLeft: 6 }}>{dashboardData?.globalStreak || 0}-day streak</Text>
            <Text style={{ fontSize: 10, color: C.textSecondary, marginLeft: 6 }}>Keep it going!</Text>
          </View>
        </View>

        {/* Weekly plan */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.foreground, marginBottom: 16 }}>
            This Week
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            {weekOrder.map((d) => {
              const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              const planDay = dashboardData?.workoutPlan?.days?.find(x => x.dayOfWeek === d || x.dayOfWeek === (d === 0 ? 7 : d));
              
              const isTodayDay = d === currentDayOfWeek;
              const isPastDay = weekOrder.indexOf(d) < weekOrder.indexOf(currentDayOfWeek);
              const isRestDay = !planDay;
              
              const actualDate = getWeekDate(d);
              
              const targetDateObj = new Date();
              targetDateObj.setDate(targetDateObj.getDate() + (weekOrder.indexOf(d) - todayIndex));
              targetDateObj.setHours(0,0,0,0);
              
              const isBeforeAccountCreation = targetDateObj < accountCreatedAt;
              
              const dateString = `${targetDateObj.getFullYear()}-${String(targetDateObj.getMonth() + 1).padStart(2, '0')}-${String(targetDateObj.getDate()).padStart(2, '0')}`;
              
              const hasSession = sessions.some(s => {
                if (!s.completedAt) return false;
                const dObj = new Date(s.completedAt);
                const sDateStr = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(dObj.getDate()).padStart(2, '0')}`;
                return sDateStr === dateString;
              });

              let status = 'upcoming';
              if (isBeforeAccountCreation) {
                status = 'inactive';
              } else if (isTodayDay) {
                status = hasSession ? 'done' : (isRestDay ? 'rest' : 'today');
              } else if (isPastDay) {
                status = isRestDay ? 'rest' : (hasSession ? 'done' : 'missed');
              } else {
                status = isRestDay ? 'rest' : 'upcoming';
              }
              
              const isToday = status === "today";
              const isDone = status === "done";
              const isRest = status === "rest";
              const isMissed = status === "missed";
              const label = planDay?.name || "Rest";

              return (
                <Pressable
                  key={d}
                  onPress={() => {
                    if (planDay) router.push(`/workout/${planDay.id}` as any);
                  }}
                  style={{ flex: 1, alignItems: 'center', gap: 6 }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: isTodayDay ? C.brand : C.textTertiary, letterSpacing: 0.5 }}>
                    {dayNames[d][0]}
                  </Text>
                  
                  <View
                    style={{
                      height: 56,
                      width: '100%',
                      borderRadius: 14,
                      backgroundColor: isTodayDay ? 'transparent' : isDone ? 'rgba(0, 217, 184, 0.1)' : isMissed ? 'rgba(255,107,107,0.08)' : isRest ? C.muted : C.card,
                      borderWidth: isTodayDay ? 0 : 1.5,
                      borderColor: isDone ? C.health : isMissed ? C.energy : C.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {isTodayDay && (
                      <LinearGradient
                        colors={['#7665F5', '#9B6FF5']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFillObject}
                      />
                    )}
                    
                    <Text style={{ fontSize: 16, fontWeight: '800', color: isTodayDay ? '#FFFFFF' : isDone ? C.health : isMissed ? C.energy : C.foreground, marginBottom: 4 }}>
                      {actualDate}
                    </Text>
                    
                    {isDone ? (
                      <CheckCircle2 size={12} color={C.health} strokeWidth={3} />
                    ) : isMissed ? (
                      <Circle size={10} color={C.energy} strokeWidth={2.5} />
                    ) : isRest ? (
                      <Text style={{ fontSize: 9 }}>🌙</Text>
                    ) : isTodayDay ? (
                      <Circle size={6} color="#FFFFFF" fill="#FFFFFF" />
                    ) : (
                      <Circle size={6} color={C.textTertiary} fill={C.textTertiary} />
                    )}
                  </View>
                  
                  <Text style={{ fontSize: 10, fontWeight: '600', color: isTodayDay ? C.brand : C.textTertiary, textAlign: 'center' }} numberOfLines={1}>
                    {isRest ? "Rest" : label.split(" ")[0]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Today's workout CTA */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Pressable
            disabled={dashboardData?.isWorkoutDoneToday}
            onPress={handleStartWorkout}
            style={({ pressed }) => [{
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: dashboardData?.isWorkoutDoneToday ? '#888' : '#7665F5',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: dashboardData?.isWorkoutDoneToday ? 0.1 : 0.35,
              shadowRadius: dashboardData?.isWorkoutDoneToday ? 10 : 28,
              elevation: dashboardData?.isWorkoutDoneToday ? 2 : 8,
            }, pressed && !dashboardData?.isWorkoutDoneToday && { transform: [{ scale: 0.95 }] }]}
          >
            <LinearGradient
              colors={dashboardData?.isWorkoutDoneToday ? ['#555', '#444'] : ['#4A39CC', '#7665F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                {dashboardData?.isWorkoutDoneToday ? (
                  <CheckCircle2 size={24} color="#FFFFFF" strokeWidth={2.5} />
                ) : (
                  <Dumbbell size={24} color="#FFFFFF" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.2 }}>
                  {nextWorkoutDay?.name || 'Rest Day'}
                </Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                  {dashboardData?.isWorkoutDoneToday ? "You crushed it today!" : (nextWorkoutDay ? `${nextWorkoutDay.exercises?.length || 0} exercises` : 'Take a break')}
                </Text>
              </View>
              <View style={{ backgroundColor: dashboardData?.isWorkoutDoneToday ? 'rgba(255,255,255,0.15)' : '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: dashboardData?.isWorkoutDoneToday ? 'rgba(255,255,255,0.8)' : '#7665F5', fontSize: 13, fontWeight: '700' }}>
                  {dashboardData?.isWorkoutDoneToday ? 'Done ✓' : 'Start'}
                </Text>
                {!dashboardData?.isWorkoutDoneToday && <ChevronRight size={14} color="#7665F5" strokeWidth={2.5} />}
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Recent workouts */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.foreground }}>Recent Sessions</Text>
            <Pressable hitSlop={12} onPress={() => router.push('/history' as any)}>
              <Text style={{ fontSize: 13, color: C.brand, fontWeight: '600' }}>See all</Text>
            </Pressable>
          </View>
          
          <View style={{ gap: 12 }}>
            {sessions.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 24, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border }}>
                <Clock size={24} color={C.textTertiary} style={{ marginBottom: 12 }} />
                <Text style={{ fontSize: 14, color: C.textSecondary, fontWeight: '600' }}>No recent sessions found.</Text>
                <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 4 }}>Complete a workout to see it here!</Text>
              </View>
            ) : (
              sessions.filter(s => s.completedAt).slice(0, 3).map((session) => {
                const durationMs = new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime();
                const durationMin = Math.max(1, Math.round(durationMs / 60000));
                const totalSets = session.exerciseLogs?.length || 0;
                
                return (
                  <View
                    key={session.id}
                    style={{
                      backgroundColor: C.card,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: C.border,
                      padding: 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 8,
                      elevation: 2,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <View>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground }}>{session.workoutDay?.name || 'Workout'}</Text>
                        <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 2 }}>
                          {new Date(session.completedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                      </View>
                      <CheckCircle2 size={20} color={C.health} strokeWidth={2} />
                    </View>
                    
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                      {[
                        { label: `${totalSets} sets`, Icon: TrendingUp },
                      ].map(({ label, Icon }, i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Icon size={12} color={C.textTertiary} />
                          <Text style={{ fontSize: 12, color: C.textSecondary, fontWeight: '500' }}>{label}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
