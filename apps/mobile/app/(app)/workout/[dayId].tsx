import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info, RefreshCw, ChevronDown, ChevronRight, Dumbbell } from 'lucide-react-native';
import { useAppTheme } from '../../../lib/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

const EXERCISES = [
  { id: 1, name: "Barbell Bench Press", sets: 4, reps: "6–8", rest: "180s", muscles: "Chest", last: "80kg × 7" },
  { id: 2, name: "Incline DB Press", sets: 3, reps: "10–12", rest: "120s", muscles: "Upper Chest", last: "30kg × 11" },
  { id: 3, name: "Overhead Press", sets: 4, reps: "8–10", rest: "150s", muscles: "Shoulders", last: "50kg × 9" },
  { id: 4, name: "Cable Lateral Raise", sets: 3, reps: "12–15", rest: "90s", muscles: "Side Delts", last: "8kg × 14" },
  { id: 5, name: "Tricep Pushdown", sets: 3, reps: "12–15", rest: "90s", muscles: "Triceps", last: "25kg × 13" },
  { id: 6, name: "Overhead Tricep Ext.", sets: 3, reps: "10–12", rest: "90s", muscles: "Long Head", last: "20kg × 12" },
  { id: 7, name: "Pec Deck Fly", sets: 3, reps: "12–15", rest: "60s", muscles: "Chest", last: "50kg × 14" },
];

export default function WorkoutDayScreen() {
  const C = useAppTheme();
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const [expanded, setExpanded] = useState<number | null>(null);
  const totalSets = EXERCISES.reduce((a, e) => a + e.sets, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ChevronLeft size={24} color={C.foreground} />
        </Pressable>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>Push Day B</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Meta chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 16 }}>
          {[
            { label: "~55 min", bg: `${C.brand}15`, color: C.brand },
            { label: `${totalSets} sets`, bg: `${C.health}15`, color: C.health },
            { label: "Chest · Shoulders · Triceps", bg: C.muted, color: C.textSecondary },
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
          {EXERCISES.map(({ id, name, sets, reps, rest, muscles, last }, idx) => {
            const isOpen = expanded === id;
            return (
              <View key={id} style={{ backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
                <Pressable onPress={() => setExpanded(isOpen ? null : id)} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${C.brand}15`, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: C.brand }}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground, letterSpacing: -0.2 }}>{name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: C.brand }}>{sets} × {reps}</Text>
                      <Text style={{ fontSize: 12, color: C.textTertiary }}>⏱ {rest}</Text>
                      <View style={{ backgroundColor: C.muted, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 }}>
                        <Text style={{ fontSize: 10, color: C.textTertiary, fontWeight: '600' }}>{muscles}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.muted, alignItems: 'center', justifyContent: 'center' }}>
                      <RefreshCw size={14} color={C.textTertiary} />
                    </Pressable>
                    <View style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
                      <ChevronDown size={18} color={C.textTertiary} />
                    </View>
                  </View>
                </Pressable>
                {isOpen && (
                  <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4, borderTopWidth: 1, borderTopColor: C.border }}>
                    <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 8 }}>
                      Previous: <Text style={{ fontWeight: '700', color: C.foreground }}>{last}</Text>
                    </Text>
                    <Text style={{ fontSize: 13, color: C.textTertiary, marginTop: 4 }}>
                      Rest: {rest} between sets
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
            onPress={() => router.push({ pathname: '/workout/active', params: { dayId: dayId || '1' } } as any)}
            style={({ pressed }) => [{
              borderRadius: 16,
              overflow: 'hidden',
              shadowColor: C.brand,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 24,
              elevation: 8,
            }, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <LinearGradient
              colors={['#7C5CFC', '#A07AF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#FFF' }}>Start Workout</Text>
              <ChevronRight size={20} color="#FFF" strokeWidth={2.5} />
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
