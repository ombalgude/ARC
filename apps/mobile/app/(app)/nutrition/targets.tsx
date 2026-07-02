import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../../../lib/themeStore';

const TARGETS = [
  { label: "Daily Calories", value: "2,650", unit: "kcal", color: "#00D9B8", desc: "Slight surplus for muscle gain" },
  { label: "Protein", value: "185", unit: "g/day", color: "#7C5CFC", desc: "1g per lb bodyweight" },
  { label: "Carbohydrates", value: "330", unit: "g/day", color: "#FF6B6B", desc: "~50% of total calories" },
  { label: "Fats", value: "75", unit: "g/day", color: "#FFB300", desc: "~25% of total calories" },
];

const TIMING = [
  { time: "Pre-workout", when: "30–60 min before", focus: "Carbs + Protein", example: "Oats + protein shake" },
  { time: "Post-workout", when: "Within 60 min", focus: "Protein + Carbs", example: "Rice + chicken breast" },
  { time: "Before bed", when: "1 hour before sleep", focus: "Slow protein", example: "Greek yogurt or cottage cheese" },
];

export default function NutritionTargetsScreen() {
  const C = useAppTheme();

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
        <View style={{ backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground, marginBottom: 16 }}>Caloric Breakdown</Text>
          
          <View style={{ flexDirection: 'row', borderRadius: 10, overflow: 'hidden', height: 22, marginBottom: 16 }}>
            <View style={{ flex: 185 * 4, backgroundColor: "#7C5CFC" }} />
            <View style={{ flex: 330 * 4, backgroundColor: "#00D9B8" }} />
            <View style={{ flex: 75 * 9, backgroundColor: "#FF6B6B" }} />
          </View>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {[
              { label: "Protein", kcal: 740, pct: 28, color: "#7C5CFC" },
              { label: "Carbs", kcal: 1320, pct: 50, color: "#00D9B8" },
              { label: "Fats", kcal: 675, pct: 25, color: "#FF6B6B" },
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

        {/* Formula */}
        <View style={{ marginTop: 24, padding: 16, backgroundColor: C.muted, borderRadius: 14, borderWidth: 1, borderColor: C.border }}>
          <Text style={{ fontSize: 13, color: C.textSecondary, lineHeight: 20 }}>
            <Text style={{ fontWeight: '700', color: C.foreground }}>Formula: </Text>
            BMR (Mifflin-St Jeor) × Activity Factor (1.55 moderate) + 300 kcal muscle gain surplus
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
