import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../../../lib/themeStore';

function generateHeatmap() {
  return Array.from({ length: 12 }, () =>
    Array.from({ length: 7 }, () => {
      const r = Math.random();
      return r > 0.8 ? 0 : r > 0.55 ? 1 : r > 0.3 ? 2 : r > 0.1 ? 3 : 4;
    })
  );
}
const heatmap = generateHeatmap();
const DAYS = ["M", "", "W", "", "F", "", "S"];

const STATS = [
  { name: "Drink Water", streak: 8, best: 21, rate: 88, color: "#06B6D4" },
  { name: "Quality Sleep", streak: 14, best: 14, rate: 82, color: "#7C5CFC" },
  { name: "10k Steps", streak: 5, best: 12, rate: 71, color: "#FF6B6B" },
  { name: "Workout", streak: 14, best: 14, rate: 93, color: "#00D9B8" },
];

export default function HabitsHistoryScreen() {
  const C = useAppTheme();
  
  // Custom colors for heatmap intensity
  const HEATMAP_COLORS = [
    C.muted, 
    'rgba(124,92,252,0.18)', 
    'rgba(124,92,252,0.36)', 
    'rgba(124,92,252,0.6)', 
    '#7C5CFC'
  ];

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
                      <View key={di} style={{ height: 14, borderRadius: 3, backgroundColor: HEATMAP_COLORS[intensity] }} />
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
            {STATS.map(({ name, streak, best, rate, color }) => (
              <View key={name} style={{ backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16 }}>
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
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
