import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Share2 } from 'lucide-react-native';
import { useAppTheme } from '../../../lib/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

const EXERCISES_LOG = [
  { name: "Barbell Bench Press", sets: 4, volume: "2,240 kg", pr: true },
  { name: "Incline DB Press", sets: 3, volume: "990 kg", pr: false },
  { name: "Overhead Press", sets: 4, volume: "1,800 kg", pr: false },
  { name: "Cable Lateral Raise", sets: 3, volume: "288 kg", pr: false },
];

export default function WorkoutSummaryScreen() {
  const C = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Celebration header */}
        <LinearGradient
          colors={['#0DA88D', '#00D9B8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: 80, paddingBottom: 48, paddingHorizontal: 24, alignItems: 'center' }}
        >
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 32 }}>🏆</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFF', letterSpacing: -0.5, marginBottom: 8, textAlign: 'center' }}>
            Workout Complete!
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '500' }}>
            Push Day A · 14-day streak maintained 🔥
          </Text>
        </LinearGradient>

        {/* Stats card */}
        <View style={{ marginHorizontal: 20, marginTop: -24, backgroundColor: C.card, borderRadius: 22, borderWidth: 1, borderColor: C.border, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {[
              { label: "Duration", value: "54", unit: "min", icon: "⏱" },
              { label: "Total Sets", value: "23", unit: "sets", icon: "📊" },
              { label: "Volume", value: "9.1k", unit: "kg", icon: "💪" },
            ].map(({ label, value, unit, icon }) => (
              <View key={label} style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 20, marginBottom: 6 }}>{icon}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: C.foreground, letterSpacing: -0.5, lineHeight: 26 }}>{value}</Text>
                  <Text style={{ fontSize: 11, color: C.textTertiary, marginBottom: 4, fontWeight: '600' }}>{unit}</Text>
                </View>
                <Text style={{ fontSize: 10, color: C.textTertiary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* PR alert */}
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: 'rgba(255, 179, 0, 0.12)', borderWidth: 1, borderColor: 'rgba(255,179,0,0.25)', borderRadius: 16 }}>
            <Text style={{ fontSize: 24 }}>🏅</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#F59E0B' }}>New Personal Record!</Text>
              <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>Barbell Bench Press — 80kg × 8 reps</Text>
            </View>
          </View>
        </View>

        {/* Muscles trained */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: C.foreground, marginBottom: 12 }}>Muscles Trained</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[
              { m: "Chest", pct: 38, c: "#7C5CFC" },
              { m: "Shoulders", pct: 28, c: "#00D9B8" },
              { m: "Triceps", pct: 22, c: "#FF6B6B" },
              { m: "Core", pct: 12, c: "#FFB300" },
            ].map(({ m, pct, c }) => (
              <View key={m} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: `${c}12`, borderWidth: 1, borderColor: `${c}25`, borderRadius: 99 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c }} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: c }}>{m}</Text>
                <Text style={{ fontSize: 12, color: C.textTertiary, fontWeight: '600' }}>{pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Exercise log */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: C.foreground, marginBottom: 12 }}>Exercise Log</Text>
          <View style={{ gap: 10 }}>
            {EXERCISES_LOG.map(({ name, sets, volume, pr }) => (
              <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border }}>
                <CheckCircle2 size={18} color={C.health} strokeWidth={2.5} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.foreground }}>{name}</Text>
                    {pr && (
                      <View style={{ backgroundColor: '#F59E0B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 }}>PR</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 2, fontWeight: '500' }}>{sets} sets · {volume}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CTAs */}
        <View style={{ paddingHorizontal: 20, marginTop: 32, gap: 12 }}>
          <Pressable
            onPress={() => router.replace('/(app)/dashboard')}
            style={({ pressed }) => [{
              borderRadius: 16,
              overflow: 'hidden',
            }, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <LinearGradient
              colors={['#7C5CFC', '#A07AF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Back to Home</Text>
            </LinearGradient>
          </Pressable>
          <Pressable
            style={({ pressed }) => [{
              padding: 16,
              backgroundColor: C.muted,
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <Share2 size={16} color={C.textSecondary} strokeWidth={2.5} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.textSecondary }}>Share Workout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
