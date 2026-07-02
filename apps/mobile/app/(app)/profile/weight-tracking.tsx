import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Plus, TrendingDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '../../../lib/themeStore';

const LOGS = [
  { date: "Jun 25", weight: "83.2 kg", tag: "Today" },
  { date: "Jun 22", weight: "83.3 kg", tag: "" },
  { date: "Jun 19", weight: "83.7 kg", tag: "" },
  { date: "Jun 15", weight: "84.0 kg", tag: "" },
  { date: "Jun 10", weight: "84.3 kg", tag: "" },
  { date: "Jun 5", weight: "84.6 kg", tag: "" },
  { date: "May 25", weight: "85.0 kg", tag: "Start" },
];

export default function WeightTrackingScreen() {
  const C = useAppTheme();
  const [showLog, setShowLog] = useState(false);
  const [newWeight, setNewWeight] = useState(83.2);
  const [filter, setFilter] = useState('1M');
  const [logs, setLogs] = useState(LOGS);

  const saveWeight = () => {
    setLogs(prev => [{ date: "Today", weight: `${newWeight.toFixed(1)} kg`, tag: "Today" }, ...prev]);
    setShowLog(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
            <ChevronLeft size={24} color={C.foreground} />
          </Pressable>
          <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground }}>Weight</Text>
        </View>
        <Pressable onPress={() => setShowLog(true)} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: `${C.brand}15`, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} color={C.brand} strokeWidth={2.5} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 }}>
          {[{ l: "Start", v: "85.0 kg", c: C.foreground }, { l: "Current", v: "83.2 kg", c: C.health }, { l: "Goal", v: "80.0 kg", c: C.brand }].map(({ l, v, c }) => (
            <View key={l} style={{ flex: 1, alignItems: 'center', paddingVertical: 16, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: c }}>{v}</Text>
              <Text style={{ fontSize: 11, color: C.textTertiary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Trend */}
        <View style={{ marginHorizontal: 20, marginBottom: 16, padding: 14, backgroundColor: `${C.health}10`, borderRadius: 14, borderWidth: 1, borderColor: `${C.health}30`, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TrendingDown size={16} color={C.health} strokeWidth={2.5} />
          <Text style={{ fontSize: 14, fontWeight: '800', color: C.health }}>−1.8 kg in 30 days</Text>
          <Text style={{ fontSize: 13, color: C.textSecondary, fontWeight: '500' }}>· 3.2 kg to goal</Text>
        </View>

        {/* Filter */}
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 }}>
          {["2W", "1M", "3M", "6M"].map((f) => (
            <Pressable key={f} onPress={() => setFilter(f)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99, backgroundColor: filter === f ? C.brand : C.muted }}>
              <Text style={{ color: filter === f ? '#FFF' : C.textSecondary, fontSize: 13, fontWeight: '700' }}>{f}</Text>
            </Pressable>
          ))}
        </View>

        {/* Chart (Mock with simple SVG path for layout) */}
        <View style={{ marginHorizontal: 20, marginBottom: 24, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16, height: 200, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: C.textTertiary, fontSize: 12, marginBottom: 10 }}>Interactive Chart Area</Text>
          <View style={{ height: 120, width: '100%' }}>
            <Svg width="100%" height="120" viewBox="0 0 300 120" preserveAspectRatio="none">
              <Defs>
                <SvgLinearGradient id="wgrad2" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={C.health} stopOpacity="0.3" />
                  <Stop offset="100%" stopColor={C.health} stopOpacity="0" />
                </SvgLinearGradient>
              </Defs>
              <Path d="M0,20 Q50,30 100,50 T200,80 T300,100 L300,120 L0,120 Z" fill="url(#wgrad2)" />
              <Path d="M0,20 Q50,30 100,50 T200,80 T300,100" stroke={C.health} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx="300" cy="100" r="5" fill={C.health} />
              <Circle cx="200" cy="80" r="4" fill={C.card} stroke={C.health} strokeWidth="2" />
              <Circle cx="100" cy="50" r="4" fill={C.card} stroke={C.health} strokeWidth="2" />
              <Circle cx="0" cy="20" r="4" fill={C.card} stroke={C.health} strokeWidth="2" />
            </Svg>
          </View>
        </View>

        {/* Log History */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: C.foreground, marginBottom: 16 }}>History</Text>
          <View style={{ gap: 10 }}>
            {logs.map(({ date, weight, tag }, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {tag ? (
                    <View style={{ backgroundColor: tag === 'Today' ? C.brand : C.muted, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: tag === 'Today' ? '#FFF' : C.textTertiary }}>{tag}</Text>
                    </View>
                  ) : null}
                  <Text style={{ fontSize: 14, color: C.textSecondary, fontWeight: '600' }}>{date}</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '800', color: C.foreground }}>{weight}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Log Sheet Modal */}
      <Modal visible={showLog} transparent animationType="slide">
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowLog(false)} />
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, marginTop: 'auto' }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 24 }} />
            
            <Text style={{ fontSize: 22, fontWeight: '800', color: C.foreground, marginBottom: 24, textAlign: 'center' }}>Log Weight</Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 32 }}>
              <Pressable
                onPress={() => setNewWeight((v) => Math.max(40, parseFloat((v - 0.1).toFixed(1))))}
                style={{ width: 60, height: 60, backgroundColor: C.muted, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 32, fontWeight: '800', color: C.foreground, lineHeight: 36 }}>−</Text>
              </Pressable>
              
              <View style={{ width: 120, alignItems: 'center' }}>
                <Text style={{ fontSize: 48, fontWeight: '800', color: C.foreground }}>{newWeight.toFixed(1)}</Text>
                <Text style={{ fontSize: 16, color: C.textTertiary, fontWeight: '600' }}>kg</Text>
              </View>

              <Pressable
                onPress={() => setNewWeight((v) => Math.min(200, parseFloat((v + 0.1).toFixed(1))))}
                style={{ width: 60, height: 60, backgroundColor: C.muted, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 32, fontWeight: '800', color: C.foreground, lineHeight: 36 }}>+</Text>
              </Pressable>
            </View>

            <Pressable onPress={saveWeight} style={{ overflow: 'hidden', borderRadius: 16 }}>
              <LinearGradient colors={['#7C5CFC', '#A07AF8']} style={{ padding: 18, alignItems: 'center' }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>Save Weight</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
