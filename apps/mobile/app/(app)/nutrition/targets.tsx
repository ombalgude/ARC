import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../../../lib/themeStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createApiClient } from '../../../lib/api';
import { useAuth } from '@clerk/clerk-expo';
import { useMemo } from 'react';

const TIMING = [
  { time: "Pre-workout", when: "30–60 min before", focus: "Carbs + Protein", example: "Oats + protein shake" },
  { time: "Post-workout", when: "Within 60 min", focus: "Protein + Carbs", example: "Rice + chicken breast" },
  { time: "Before bed", when: "1 hour before sleep", focus: "Slow protein", example: "Greek yogurt or cottage cheese" },
];

export default function NutritionTargetsScreen() {
  const C = useAppTheme();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  });

  const now = new Date();
  const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const { data: rawHabits } = useQuery({
    queryKey: ['habits-detail', localDate],
    queryFn: () => api.getHabits(localDate).then(res => res.habits),
  });
  
  const queryClient = useQueryClient();

  const macrosHabit = rawHabits?.find(h => h.type === 'macros');
  const isMacrosHit = macrosHabit?.completedToday ?? false;

  const { mutate: toggleMacros, isPending: isLogging } = useMutation({
    mutationFn: async () => {
      if (!macrosHabit) return;
      return api.logHabit({ habitId: macrosHabit.id, localDate, completed: !isMacrosHit }).catch(() => null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits-detail', localDate] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-habits', localDate] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const nutrition = dashboardData?.nutrition;

  const TARGETS = [
    { label: "Daily Calories", value: nutrition?.caloriesTarget?.toString() || "-", unit: "kcal", color: "#00D9B8", desc: nutrition?.goal === 'build_muscle' ? "Slight surplus for muscle gain" : "Based on your goal" },
    { label: "Protein", value: nutrition?.proteinG?.toString() || "-", unit: "g/day", color: "#7C5CFC", desc: "1g per lb bodyweight" },
    { label: "Carbohydrates", value: nutrition?.carbsG?.toString() || "-", unit: "g/day", color: "#FF6B6B", desc: "~50% of total calories" },
    { label: "Fats", value: nutrition?.fatG?.toString() || "-", unit: "g/day", color: "#FFB300", desc: "~25% of total calories" },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={C.brand} />
      </SafeAreaView>
    );
  }

  const proteinKcal = (nutrition?.proteinG || 0) * 4;
  const carbsKcal = (nutrition?.carbsG || 0) * 4;
  const fatsKcal = (nutrition?.fatG || 0) * 9;
  const totalKcal = proteinKcal + carbsKcal + fatsKcal;
  
  const proteinPct = totalKcal > 0 ? Math.round((proteinKcal / totalKcal) * 100) : 0;
  const carbsPct = totalKcal > 0 ? Math.round((carbsKcal / totalKcal) * 100) : 0;
  const fatsPct = totalKcal > 0 ? Math.round((fatsKcal / totalKcal) * 100) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ChevronLeft size={24} color={C.foreground} />
        </Pressable>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>Nutrition Targets</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Binary Logging */}
        {macrosHabit && (
          <View style={{ backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: C.foreground, marginBottom: 4 }}>Hit your targets today?</Text>
              <Text style={{ fontSize: 12, color: C.textSecondary }}>Stay consistent to build your streak.</Text>
            </View>
            <Pressable
              disabled={isLogging}
              onPress={() => toggleMacros()}
              style={({ pressed }) => [{
                width: 60, height: 34, borderRadius: 17,
                backgroundColor: isMacrosHit ? C.health : C.muted,
                padding: 2,
                justifyContent: 'center',
                opacity: isLogging ? 0.7 : pressed ? 0.9 : 1,
              }]}
            >
              <View style={{
                width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF',
                alignSelf: isMacrosHit ? 'flex-end' : 'flex-start',
                shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2,
              }} />
            </Pressable>
          </View>
        )}
        
        {/* Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          {TARGETS.map(({ label, value, unit, color, desc }) => (
            <View key={label} style={{ width: '48%', flexGrow: 1, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16 }}>
              <View style={{ alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: `${color}15`, marginBottom: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: C.foreground, letterSpacing: -1, lineHeight: 32 }}>{value}</Text>
                <Text style={{ fontSize: 11, color: C.textTertiary, marginBottom: 4, fontWeight: '600' }}>{unit}</Text>
              </View>
              <Text style={{ fontSize: 11, color: C.textSecondary, lineHeight: 16, fontWeight: '500' }}>{desc}</Text>
            </View>
          ))}
        </View>

        {/* Macro breakdown */}
        {totalKcal > 0 && (
          <View style={{ backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 24 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground, marginBottom: 16 }}>Caloric Breakdown</Text>
            
            <View style={{ flexDirection: 'row', borderRadius: 10, overflow: 'hidden', height: 22, marginBottom: 16 }}>
              <View style={{ flex: proteinKcal, backgroundColor: "#7C5CFC" }} />
              <View style={{ flex: carbsKcal, backgroundColor: "#00D9B8" }} />
              <View style={{ flex: fatsKcal, backgroundColor: "#FF6B6B" }} />
            </View>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {[
                { label: "Protein", kcal: proteinKcal, pct: proteinPct, color: "#7C5CFC" },
                { label: "Carbs", kcal: carbsKcal, pct: carbsPct, color: "#00D9B8" },
                { label: "Fats", kcal: fatsKcal, pct: fatsPct, color: "#FF6B6B" },
              ].map(({ label, kcal, pct, color }) => (
                <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color }} />
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: C.foreground }}>{pct}%</Text>
                    <Text style={{ fontSize: 11, color: C.textTertiary, fontWeight: '500', marginTop: 2 }}>{label} · {kcal} kcal</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Meal timing */}
        <Text style={{ fontSize: 17, fontWeight: '800', color: C.foreground, marginBottom: 16 }}>Meal Timing Guide</Text>
        <View style={{ gap: 12 }}>
          {TIMING.map(({ time, when, focus, example }) => (
            <View key={time} style={{ backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: `${C.brand}15` }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: C.brand, letterSpacing: 1, textTransform: 'uppercase' }}>{time}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: C.textTertiary, fontWeight: '600' }}>{when}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground, marginTop: 4 }}>{focus}</Text>
                  <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>e.g. {example}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
