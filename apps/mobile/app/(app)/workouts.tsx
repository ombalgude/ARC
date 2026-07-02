import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Circle, Clock, ChevronRight, TrendingUp, Calendar, Dumbbell, Flame, Timer } from 'lucide-react-native';

import { useAppTheme } from '../../lib/themeStore';

const WEEK_DAYS = [
  { day: "Mon", label: "Push A", status: "done", muscles: "Chest · Shoulders" },
  { day: "Tue", label: "Pull A", status: "done", muscles: "Back · Biceps" },
  { day: "Wed", label: "Rest", status: "rest", muscles: "" },
  { day: "Thu", label: "Push B", status: "today", muscles: "Chest · Triceps" },
  { day: "Fri", label: "Pull B", status: "upcoming", muscles: "Back · Biceps" },
  { day: "Sat", label: "Legs", status: "upcoming", muscles: "Quads · Hams" },
  { day: "Sun", label: "Rest", status: "upcoming", muscles: "" },
];

const HISTORY = [
  { name: "Pull Day A", date: "Yesterday", duration: "48 min", sets: 22, volume: "4,200 kg" },
  { name: "Push Day A", date: "Monday", duration: "52 min", sets: 24, volume: "4,800 kg" },
  { name: "Legs A", date: "Saturday", duration: "61 min", sets: 28, volume: "6,100 kg" },
];

export default function WorkoutsScreen() {
  const C = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground, letterSpacing: -0.7 }}>
              Workouts
            </Text>
            <Pressable onPress={() => router.push('/history' as any)}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.brand }}>History</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 13, color: C.textSecondary }}>Push Pull Legs — Week 3</Text>
        </View>

        {/* Stats bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 20 }}>
          {[
            { value: "14", label: "Workouts", Icon: Dumbbell, color: "#7665F5" },
            { value: "8h 24m", label: "Total Time", Icon: Timer, color: "#14C9A4" },
            { value: "14", label: "Day Streak", Icon: Flame, color: "#F97316" },
          ].map(({ value, label, Icon, color }) => (
            <View
              key={label}
              style={{
                backgroundColor: C.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: C.border,
                minWidth: 110,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ marginBottom: 8 }}>
                <Icon size={20} color={color} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>{value}</Text>
              <Text style={{ fontSize: 11, color: C.textTertiary, fontWeight: '600', marginTop: 2 }}>{label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Weekly plan */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.foreground, marginBottom: 16 }}>
            This Week
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            {WEEK_DAYS.map(({ day, label, status }) => {
              const isToday = status === "today";
              const isDone = status === "done";
              const isRest = status === "rest";
              return (
                <Pressable
                  key={day}
                  onPress={() => router.push({ pathname: '/workout/[dayId]', params: { dayId: '1' } } as any)}
                  style={{ flex: 1, alignItems: 'center', gap: 6 }}
                >
                  <Text style={{ fontSize: 10, fontWeight: '600', color: C.textTertiary, letterSpacing: 0.5 }}>
                    {day}
                  </Text>
                  <View
                    style={{
                      height: 44,
                      width: '100%',
                      borderRadius: 12,
                      backgroundColor: isToday ? 'transparent' : isDone ? 'rgba(0, 217, 184, 0.12)' : isRest ? C.muted : C.card,
                      borderWidth: isToday ? 0 : 1.5,
                      borderColor: isDone ? C.health : C.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {isToday && (
                      <LinearGradient
                        colors={['#7665F5', '#9B6FF5']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFillObject}
                      />
                    )}
                    {isDone ? (
                      <CheckCircle2 size={18} color={C.health} strokeWidth={2.5} />
                    ) : isRest ? (
                      <Text style={{ fontSize: 14 }}>🌙</Text>
                    ) : isToday ? (
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>{label.split(" ")[0]}</Text>
                    ) : (
                      <Circle size={16} color={C.textTertiary} strokeWidth={1.5} />
                    )}
                  </View>
                  <Text style={{ fontSize: 9, fontWeight: '600', color: isToday ? C.brand : C.textTertiary, textAlign: 'center' }}>
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
            onPress={() => router.push({ pathname: '/workout/[dayId]', params: { dayId: '1' } } as any)}
            style={({ pressed }) => [{
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: '#7665F5',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 28,
              elevation: 8,
            }, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <LinearGradient
              colors={['#4A39CC', '#7665F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Dumbbell size={24} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.2 }}>Push Day B</Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>7 exercises · ~55 minutes</Text>
              </View>
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: '#7665F5', fontSize: 13, fontWeight: '700' }}>Start</Text>
                <ChevronRight size={14} color="#7665F5" strokeWidth={2.5} />
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Recent workouts */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.foreground }}>Recent Sessions</Text>
            <Pressable onPress={() => router.push('/history' as any)}>
              <Text style={{ fontSize: 13, color: C.brand, fontWeight: '600' }}>See all</Text>
            </Pressable>
          </View>
          
          <View style={{ gap: 12 }}>
            {HISTORY.map(({ name, date, duration, sets, volume }) => (
              <View
                key={name}
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
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground }}>{name}</Text>
                    <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 2 }}>{date}</Text>
                  </View>
                  <CheckCircle2 size={20} color={C.health} strokeWidth={2} />
                </View>
                
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  {[
                    { label: duration, Icon: Clock },
                    { label: `${sets} sets`, Icon: TrendingUp },
                    { label: volume, Icon: Calendar },
                  ].map(({ label, Icon }) => (
                    <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Icon size={12} color={C.textTertiary} />
                      <Text style={{ fontSize: 12, color: C.textSecondary, fontWeight: '500' }}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
