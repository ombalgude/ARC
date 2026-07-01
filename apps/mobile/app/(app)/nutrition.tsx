import { useAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
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

import { createApiClient, type DashboardData } from '../../lib/api';

import { Appearance } from 'react-native';
import { LightColors, DarkColors } from '../../../../packages/ui/src/tokens/theme';

const isDark = Appearance.getColorScheme() === 'dark';
const C = isDark ? DarkColors : LightColors;

const TIPS = [
  'Prioritize protein at every meal — aim for 30–40g per sitting.',
  'Carbs around training = better performance + recovery.',
];

function ProgressRingMock({ 
  pct, 
  color, 
  size, 
  children 
}: { 
  pct: number; 
  color: string; 
  size: number;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.ringContainer, { width: size, height: size }]}>
      <View style={[styles.ringTrack, { borderColor: C.muted }]} />
      {/* Note: Standard React Native doesn't have a simple SVG ring out-of-the-box without react-native-svg.
          Using a CSS border mockup with a badge instead for now */}
      <View style={[styles.ringFill, { borderColor: color, transform: [{ rotate: '45deg' }] }]} />
      <View style={styles.ringInner}>{children}</View>
    </View>
  );
}

export default function NutritionScreen(): React.JSX.Element {
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

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={C.brand} size="large" />
      </View>
    );
  }

  const nutrition = dashboard?.nutrition;
  const cals = { now: 1840, target: nutrition?.caloriesTarget ?? 2500 }; // Mocked 'now' for MVP visual
  const calsPct = Math.min(100, Math.round((cals.now / cals.target) * 100));
  const calsRemaining = Math.max(0, cals.target - cals.now);

  const macros = [
    { label: 'Protein', current: 142, target: nutrition?.proteinG ?? 150, color: '#7C5CFC', unit: 'g', icon: '🥩' },
    { label: 'Carbs', current: 198, target: nutrition?.carbsG ?? 200, color: '#00D9B8', unit: 'g', icon: '🌾' },
    { label: 'Fats', current: 51, target: nutrition?.fatG ?? 70, color: '#FF6B6B', unit: 'g', icon: '🥑' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nutrition</Text>
          <Text style={styles.subtitle}>Goal: {nutrition?.goal ?? 'Build Muscle'} · {cals.target} kcal target</Text>
        </View>

        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Calorie Card */}
        <View style={styles.card}>
          <View style={styles.calRow}>
            <ProgressRingMock size={96} pct={calsPct} color={C.health}>
              <Text style={styles.ringValue}>{cals.now}</Text>
              <Text style={styles.ringLabel}>KCAL</Text>
            </ProgressRingMock>
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
            const pct = Math.round((m.current / m.target) * 100);
            return (
              <View key={m.label} style={styles.macroTile}>
                <ProgressRingMock size={64} pct={pct} color={m.color}>
                  <Text style={{ fontSize: 18 }}>{m.icon}</Text>
                </ProgressRingMock>
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
                <View style={[styles.progressBarFill, { backgroundColor: m.color, width: `${Math.min(100, (m.current / m.target) * 100)}%` }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tips</Text>
        </View>
        <View style={styles.tipsContainer}>
          {TIPS.map((tip, i) => (
            <View key={i} style={styles.tipCard}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringTrack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 6,
  },
  ringFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 6,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  ringInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: { fontSize: 20, fontWeight: '700', color: C.foreground },
  ringLabel: { fontSize: 9, fontWeight: '700', color: C.textTertiary, letterSpacing: 1 },
});
