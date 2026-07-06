import { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Plus, TrendingDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-gifted-charts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo';
import { useAppTheme } from '../../../lib/themeStore';
import { createApiClient } from '../../../lib/api';

export default function WeightTrackingScreen() {
  const C = useAppTheme();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(async () => await getToken()), [getToken]);
  const queryClient = useQueryClient();

  const [showLog, setShowLog] = useState(false);
  const [newWeight, setNewWeight] = useState(83.2);
  const [filter, setFilter] = useState('1M');

  const { data: meResponse } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.getMe(),
  });

  const { data: logsResponse, isLoading } = useQuery({
    queryKey: ['weightLogs'],
    queryFn: () => api.getWeightLogs(),
  });

  const mutation = useMutation({
    mutationFn: (weight: number) => api.addWeightLog(weight),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightLogs'] });
      setShowLog(false);
    },
  });

  const logs = logsResponse?.logs || [];
  
  const profileWeight = meResponse?.profile?.weightKg ? parseFloat(meResponse.profile.weightKg as string) : 0;
  const startWeight = logs.length > 0 ? parseFloat(logs[logs.length - 1].weightKg) : profileWeight;
  const currentWeight = logs.length > 0 ? parseFloat(logs[0].weightKg) : profileWeight;
  
  const goal = meResponse?.profile?.goal as string;
  const targetWeight = goal === 'losefat' ? startWeight - 5 : (goal === 'buildmuscle' ? startWeight + 5 : startWeight);

  const chartData = useMemo(() => {
    if (!logs.length) return [];
    // Sort ascending for chart (oldest first)
    return [...logs].reverse().map((log) => ({
      value: parseFloat(log.weightKg),
      date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    }));
  }, [logs]);

  const saveWeight = () => {
    mutation.mutate(newWeight);
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
          {[{ l: "Start", v: `${startWeight.toFixed(1)} kg`, c: C.foreground }, { l: "Current", v: `${currentWeight.toFixed(1)} kg`, c: C.health }, { l: "Goal", v: `${targetWeight.toFixed(1)} kg`, c: C.brand }].map(({ l, v, c }) => (
            <View key={l} style={{ flex: 1, alignItems: 'center', paddingVertical: 16, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: c }}>{v}</Text>
              <Text style={{ fontSize: 11, color: C.textTertiary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Trend */}
        <View style={{ marginHorizontal: 20, marginBottom: 16, padding: 14, backgroundColor: `${C.health}10`, borderRadius: 14, borderWidth: 1, borderColor: `${C.health}30`, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TrendingDown size={16} color={C.health} strokeWidth={2.5} />
          <Text style={{ fontSize: 14, fontWeight: '800', color: C.health }}>
            {currentWeight <= startWeight ? `−${(startWeight - currentWeight).toFixed(1)} kg` : `+${(currentWeight - startWeight).toFixed(1)} kg`} overall
          </Text>
          <Text style={{ fontSize: 13, color: C.textSecondary, fontWeight: '500' }}>· {(Math.abs(currentWeight - targetWeight)).toFixed(1)} kg to goal</Text>
        </View>

        {/* Filter */}
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 }}>
          {["2W", "1M", "3M", "6M"].map((f) => (
            <Pressable key={f} onPress={() => setFilter(f)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99, backgroundColor: filter === f ? C.brand : C.muted }}>
              <Text style={{ color: filter === f ? '#FFF' : C.textSecondary, fontSize: 13, fontWeight: '700' }}>{f}</Text>
            </Pressable>
          ))}
        </View>

        {/* Chart */}
        <View style={{ marginHorizontal: 20, marginBottom: 24, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16, height: 200, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {isLoading ? (
            <ActivityIndicator color={C.brand} />
          ) : chartData.length > 0 ? (
            <LineChart
              data={chartData}
              width={300}
              height={140}
              thickness={3}
              color={C.health}
              hideDataPoints={false}
              dataPointsColor={C.card}
              dataPointsRadius={4}
              customDataPoint={() => (
                <View style={{ width: 8, height: 8, backgroundColor: C.card, borderRadius: 4, borderWidth: 2, borderColor: C.health }} />
              )}
              hideRules
              hideYAxisText
              hideAxesAndRules
              yAxisLabelSuffix=" kg"
              pointerConfig={{
                pointerStripHeight: 140,
                pointerStripColor: C.border,
                pointerStripWidth: 2,
                pointerColor: C.health,
                radius: 4,
                pointerLabelWidth: 80,
                pointerLabelHeight: 30,
                activatePointersOnLongPress: true,
                autoAdjustPointerLabelPosition: true,
                pointerLabelComponent: (items: any) => {
                  return (
                    <View style={{ backgroundColor: C.card, padding: 4, borderRadius: 8, borderWidth: 1, borderColor: C.border, alignItems: 'center' }}>
                      <Text style={{ color: C.foreground, fontWeight: 'bold' }}>{items[0].value} kg</Text>
                      <Text style={{ color: C.textTertiary, fontSize: 10 }}>{items[0].date}</Text>
                    </View>
                  );
                },
              }}
              curved
              startFillColor={C.health}
              startOpacity={0.3}
              endFillColor={C.health}
              endOpacity={0}
              areaChart
            />
          ) : (
            <Text style={{ color: C.textTertiary, fontSize: 14 }}>No weight logs yet.</Text>
          )}
        </View>

        {/* Log History */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: C.foreground, marginBottom: 16 }}>History</Text>
          <View style={{ gap: 10 }}>
            {logs.map((log: any, i: number) => {
              const logDate = new Date(log.date);
              const isToday = new Date().toDateString() === logDate.toDateString();
              const isStart = i === logs.length - 1;
              const tag = isToday ? 'Today' : (isStart ? 'Start' : '');
              return (
                <View key={log.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {tag ? (
                      <View style={{ backgroundColor: tag === 'Today' ? C.brand : C.muted, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: tag === 'Today' ? '#FFF' : C.textTertiary }}>{tag}</Text>
                      </View>
                    ) : null}
                    <Text style={{ fontSize: 14, color: C.textSecondary, fontWeight: '600' }}>
                      {logDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: C.foreground }}>{parseFloat(log.weightKg).toFixed(1)} kg</Text>
                </View>
              );
            })}
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

            <Pressable onPress={saveWeight} style={{ overflow: 'hidden', borderRadius: 16 }} disabled={mutation.isPending}>
              <LinearGradient colors={['#7C5CFC', '#A07AF8']} style={{ padding: 18, alignItems: 'center' }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                {mutation.isPending ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>Save Weight</Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
