import { useAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Circle } from 'lucide-react-native';

import { createApiClient, type DashboardData } from '../../../lib/api';
import { useAppTheme } from '../../../lib/themeStore';
import { ProgressRing } from '../../../../../packages/ui/src/ProgressRing';

const TIPS = [
  'Prioritize protein at every meal — aim for 30–40g per sitting.',
  'Carbs around training = better performance + recovery.',
];

export default function NutritionScreen(): React.JSX.Element {
  const C = useAppTheme();
  
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.background },
    content: { padding: 20 },
    header: { marginBottom: 16 },
    title: { fontSize: 28, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 },
    subtitle: { fontSize: 13, color: C.textTertiary, marginTop: 4 },
    errorBanner: { padding: 12, backgroundColor: 'rgba(255,107,107,0.1)', borderRadius: 12, marginBottom: 16 },
    errorText: { color: C.energy, fontSize: 13, textAlign: 'center' },
    
    card: {
      backgroundColor: C.card,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: C.border,
      padding: 18,
      marginBottom: 16,
    },
    calRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    calDetails: { flex: 1 },
    calDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    calDetailLabel: { fontSize: 13, color: C.textSecondary },
    calDetailValue: { fontSize: 13, fontWeight: '700', color: C.foreground },
    divider: { height: 1, backgroundColor: C.border, marginVertical: 8 },
    
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: C.foreground },
    
    macroGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    macroTile: {
      flex: 1,
      backgroundColor: C.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: C.border,
      paddingVertical: 14,
      alignItems: 'center',
    },
    macroTileValue: { fontSize: 16, fontWeight: '700', color: C.foreground, marginTop: 8 },
    macroTileLabel: { fontSize: 11, color: C.textTertiary, fontWeight: '600', marginTop: 2 },
    macroTilePct: { fontSize: 11, fontWeight: '700', marginTop: 2 },
    
    macroBarHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    macroBarTitle: { fontSize: 14, fontWeight: '600', color: C.foreground },
    macroBarNumbers: { fontSize: 14, fontWeight: '700', color: C.foreground },
    progressBarBg: { height: 6, backgroundColor: C.muted, borderRadius: 99 },
    progressBarFill: { height: '100%', borderRadius: 99 },
    
    tipsContainer: { gap: 8 },
    tipCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor: C.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: C.border,
      padding: 14,
    },
    tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.brand, marginTop: 6 },
    tipText: { fontSize: 14, color: C.textSecondary, lineHeight: 20, flex: 1 },
    
    ringValue: { fontSize: 20, fontWeight: '700', color: C.foreground },
    ringLabel: { fontSize: 9, fontWeight: '700', color: C.textTertiary, letterSpacing: 1 },
  }), [C]);

  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const result = await api.getDashboard();
        if (isMounted) setDashboard(result);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load nutrition data.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    void loadData();
    return () => { isMounted = false; };
  }, [api]);

  const queryClient = useQueryClient();
  const now = new Date();
  const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const { data: habitsArray } = useQuery({
    queryKey: ['habits-detail', localDate],
    queryFn: () => api.getHabits(localDate).then(res => res.habits),
  });
  
  const macrosHabit = habitsArray?.find(h => h.type === 'macros');
  const isCompleted = macrosHabit?.completedToday;

  const toggleMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      if (!macrosHabit) return;
      await api.logHabit({
        habitId: macrosHabit.id,
        localDate: localDate,
        completed
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits-detail', localDate] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    }
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={C.brand} size="large" />
      </View>
    );
  }

  const nutrition = dashboard?.nutrition;
  const cals = { 
    now: isCompleted ? (nutrition?.caloriesTarget ?? 0) : 0, 
    target: nutrition?.caloriesTarget ?? 0 
  };
  const calsPct = cals.target > 0 ? Math.min(100, Math.round((cals.now / cals.target) * 100)) : 0;
  const calsRemaining = Math.max(0, cals.target - cals.now);

  const macros = [
    { label: 'Protein', current: isCompleted ? (nutrition?.proteinG ?? 0) : 0, target: nutrition?.proteinG ?? 0, color: '#7C5CFC', unit: 'g', icon: '🥩' },
    { label: 'Carbs', current: isCompleted ? (nutrition?.carbsG ?? 0) : 0, target: nutrition?.carbsG ?? 0, color: '#00D9B8', unit: 'g', icon: '🌾' },
    { label: 'Fats', current: isCompleted ? (nutrition?.fatG ?? 0) : 0, target: nutrition?.fatG ?? 0, color: '#FF6B6B', unit: 'g', icon: '🥑' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.title}>Nutrition</Text>
            <Pressable hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} onPress={() => router.push('/nutrition/targets' as any)}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.brand }}>Targets</Text>
            </Pressable>
          </View>
          <Text style={styles.subtitle}>Goal: {nutrition?.goal ?? 'Build Muscle'} · {cals.target} kcal target</Text>
        </View>

        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Daily Completion Check */}
        {macrosHabit && (
          <Pressable
            onPress={() => toggleMutation.mutate(!isCompleted)}
            disabled={toggleMutation.isPending}
            style={({ pressed }) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isCompleted ? 'rgba(0, 217, 184, 0.1)' : C.card,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: isCompleted ? C.health : C.border,
                padding: 16,
                marginBottom: 16,
              },
              pressed && { opacity: 0.8 }
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: isCompleted ? C.health : C.foreground }}>
                {isCompleted ? "Macros completed today!" : "Hit your macros today?"}
              </Text>
              <Text style={{ fontSize: 13, color: isCompleted ? C.health : C.textSecondary, marginTop: 2, opacity: 0.8 }}>
                {isCompleted ? "Great job sticking to your plan." : "Mark complete to maintain your streak."}
              </Text>
            </View>
            <View>
              {toggleMutation.isPending ? (
                <ActivityIndicator color={C.health} size="small" />
              ) : isCompleted ? (
                <CheckCircle2 size={28} color={C.health} strokeWidth={2.5} />
              ) : (
                <Circle size={28} color={C.textTertiary} strokeWidth={1.5} />
              )}
            </View>
          </Pressable>
        )}

        {/* Calorie Card */}
        <View style={styles.card}>
          <View style={styles.calRow}>
            <ProgressRing size={96} strokeWidth={8} progress={calsPct} color={C.health} trackColor={C.muted}>
              <Text style={styles.ringValue}>{cals.now}</Text>
              <Text style={styles.ringLabel}>KCAL</Text>
            </ProgressRing>
            <View style={styles.calDetails}>
              <View style={styles.calDetailRow}>
                <Text style={styles.calDetailLabel}>Consumed</Text>
                <Text style={styles.calDetailValue}>{cals.now} kcal</Text>
              </View>
              <View style={styles.calDetailRow}>
                <Text style={styles.calDetailLabel}>Target</Text>
                <Text style={styles.calDetailValue}>{cals.target} kcal</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.calDetailRow}>
                <Text style={[styles.calDetailLabel, { color: C.health }]}>Remaining</Text>
                <Text style={[styles.calDetailValue, { color: C.health }]}>{calsRemaining} kcal</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Macro Rings (Grid) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Macros</Text>
        </View>
        
        <View style={styles.macroGrid}>
          {macros.map((m) => {
            const pct = m.target > 0 ? Math.round((m.current / m.target) * 100) : 0;
            return (
              <View key={m.label} style={styles.macroTile}>
                <ProgressRing size={64} strokeWidth={6} progress={pct} color={m.color} trackColor={C.muted}>
                  <Text style={{ fontSize: 18 }}>{m.icon}</Text>
                </ProgressRing>
                <Text style={styles.macroTileValue}>{m.current}{m.unit}</Text>
                <Text style={styles.macroTileLabel}>{m.label}</Text>
                <Text style={[styles.macroTilePct, { color: m.color }]}>{pct}%</Text>
              </View>
            );
          })}
        </View>

        {/* Macro Bars */}
        <View style={styles.card}>
          {macros.map((m, i) => (
            <View key={m.label} style={i < macros.length - 1 ? { marginBottom: 16 } : undefined}>
              <View style={styles.macroBarHeader}>
                <Text style={styles.macroBarTitle}>{m.label}</Text>
                <Text style={styles.macroBarNumbers}>
                  {m.current}{m.unit} <Text style={{ color: C.textTertiary, fontWeight: '400' }}>/ {m.target}{m.unit}</Text>
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { backgroundColor: m.color, width: `${m.target > 0 ? Math.min(100, (m.current / m.target) * 100) : 0}%` }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tips</Text>
          <Pressable hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} onPress={() => router.push('/nutrition/guidance' as any)}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.brand }}>All →</Text>
          </Pressable>
        </View>
        <View style={styles.tipsContainer}>
          {TIPS.map((tip, i) => (
            <Pressable key={i} style={styles.tipCard} onPress={() => router.push('/nutrition/guidance' as any)}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </Pressable>
          ))}
        </View>
        
        {/* CTA */}
        <View style={{ marginTop: 24, marginBottom: 40 }}>
          <Pressable
            onPress={() => router.push('/nutrition/guidance' as any)}
            style={({ pressed }) => [
              {
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                backgroundColor: `${C.brand}15`,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: `${C.brand}25`,
              },
              pressed && { opacity: 0.8 }
            ]}
          >
            <View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: C.brand }}>Full Nutrition Guidance</Text>
              <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>Protein sources, meal timing & more</Text>
            </View>
            <View>
               <Text style={{ fontSize: 18, color: C.brand, fontWeight: '700' }}>→</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
