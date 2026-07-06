import { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../../../lib/themeStore';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { createApiClient } from '../../../lib/api';

const DAYS = ["S", "", "T", "", "T", "", "S"];

const DEFAULT_CONFIG: Record<string, any> = {
  water: { name: "Drink Water", color: "#06B6D4" },
  sleep: { name: "Quality Sleep", color: "#7C5CFC" },
  steps: { name: "10k Steps", color: "#FF6B6B" },
  workout: { name: "Workout", color: "#00D9B8" },
  macros: { name: "Nutrition", color: "#FFB300" },
};

function generateHeatmap(logs: any[], habits: any[], todayStr: string) {
  const completionsPerDay = new Map<string, number>();

  const habitLogsByDate = new Map<string, Map<string, any[]>>();
  for (const log of logs) {
    if (!habitLogsByDate.has(log.loggedDate)) {
      habitLogsByDate.set(log.loggedDate, new Map());
    }
    const dayMap = habitLogsByDate.get(log.loggedDate)!;
    if (!dayMap.has(log.habitId)) {
      dayMap.set(log.habitId, []);
    }
    dayMap.get(log.habitId)!.push(log);
  }

  for (const [dateStr, dayMap] of habitLogsByDate.entries()) {
    let completedCount = 0;
    for (const [habitId, hLogs] of dayMap.entries()) {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) continue;
      const dayValue = hLogs.reduce((sum: number, l: any) => sum + Number(l.value ?? 0), 0);
      const isCompleted = (hLogs.length > 0 ? (hLogs[0]?.completed ?? false) : false) || 
          (habit.targetValue !== null && dayValue >= Number(habit.targetValue));
      if (isCompleted) {
        completedCount++;
      }
    }
    completionsPerDay.set(dateStr, completedCount);
  }

  const grid = Array.from({ length: 12 }, () => Array.from({ length: 7 }, () => 0));
  
  const todayObj = new Date(todayStr + 'T00:00:00Z');
  const todayDayOfWeek = todayObj.getUTCDay();

  for (let week = 0; week < 12; week++) {
    for (let day = 0; day < 7; day++) {
      const weekOffset = 11 - week;
      const daysAgo = weekOffset * 7 + (todayDayOfWeek - day);
      if (daysAgo < 0) continue; 
      if (daysAgo >= 84) continue; 
      
      const targetDate = new Date(todayObj);
      targetDate.setUTCDate(targetDate.getUTCDate() - daysAgo);
      const targetDateStr = `${targetDate.getUTCFullYear()}-${String(targetDate.getUTCMonth()+1).padStart(2,'0')}-${String(targetDate.getUTCDate()).padStart(2,'0')}`;
      
      const count = completionsPerDay.get(targetDateStr) || 0;
      const intensity = Math.min(4, count);
      grid[week]![day] = intensity;
    }
  }

  return grid;
}

export default function HabitsHistoryScreen() {
  const C = useAppTheme();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  
  const now = new Date();
  const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const { data, isLoading } = useQuery({
    queryKey: ['habits-history', localDate],
    queryFn: () => api.getHabits(localDate),
  });

  const habits = data?.habits || [];
  const logs = data?.logs || [];

  const heatmap = useMemo(() => {
    return generateHeatmap(logs, habits, localDate);
  }, [logs, habits, localDate]);
  
  const HEATMAP_COLORS = [
    C.muted, 
    'rgba(124,92,252,0.18)', 
    'rgba(124,92,252,0.36)', 
    'rgba(124,92,252,0.6)', 
    '#7C5CFC'
  ];

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
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ChevronLeft size={24} color={C.foreground} />
        </Pressable>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>Habit History</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Heatmap */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: C.foreground, marginBottom: 16 }}>Last 3 Months</Text>
          <View style={{ backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {/* Day labels */}
              <View style={{ gap: 3, width: 14 }}>
                {DAYS.map((d, i) => (
                  <View key={i} style={{ height: 14, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 9, color: C.textTertiary, fontWeight: '600' }}>{d}</Text>
                  </View>
                ))}
              </View>
              {/* Cells */}
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                {heatmap.map((week, wi) => (
                  <View key={wi} style={{ gap: 3, width: 14 }}>
                    {week.map((intensity, di) => (
                      <View key={`${wi}-${di}`} style={{ height: 14, borderRadius: 3, backgroundColor: HEATMAP_COLORS[intensity] }} />
                    ))}
                  </View>
                ))}
              </View>
            </View>
            
            {/* Legend */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 12 }}>
              <Text style={{ fontSize: 10, color: C.textTertiary }}>Less</Text>
              {HEATMAP_COLORS.map((c, i) => (
                <View key={i} style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: c }} />
              ))}
              <Text style={{ fontSize: 10, color: C.textTertiary }}>More</Text>
            </View>
          </View>
        </View>

        {/* Per-habit */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: C.foreground, marginBottom: 16 }}>Per Habit</Text>
          <View style={{ gap: 12 }}>
            {habits
              .filter((h: any) => !['macros', 'protein', 'carbs', 'fats', 'micros', 'meal_breakfast', 'meal_lunch', 'meal_preworkout', 'meal_postworkout'].includes(h.type))
              .map((habit: any) => {
              const name = DEFAULT_CONFIG[habit.type]?.name || habit.type || 'Habit';
              const color = habit.colorHex || DEFAULT_CONFIG[habit.type]?.color || C.brand;
              const rate = habit.completionRate ?? 0;
              const streak = habit.streak ?? 0;
              const best = habit.bestStreak ?? 0;
              
              return (
              <View key={habit.id} style={{ backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground }}>{name}</Text>
                  </View>
                  <View style={{ backgroundColor: `${color}15`, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
                    <Text style={{ fontSize: 13, fontWeight: '800', color }}>{rate}%</Text>
                  </View>
                </View>
                
                <View style={{ height: 6, backgroundColor: C.muted, borderRadius: 99, marginBottom: 16, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${rate}%`, backgroundColor: color, borderRadius: 99 }} />
                </View>
                
                <View style={{ flexDirection: 'row', gap: 32 }}>
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>🔥 {streak}d</Text>
                    <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 2, fontWeight: '500' }}>Current streak</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>🏆 {best}d</Text>
                    <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 2, fontWeight: '500' }}>Best streak</Text>
                  </View>
                </View>
              </View>
            )})}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
