import { useAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createApiClient, type SessionLog } from '../../lib/api';

import { Appearance } from 'react-native';
import { LightColors, DarkColors } from '../../../../packages/ui/src/tokens/theme';

const isDark = Appearance.getColorScheme() === 'dark';
const C = isDark ? DarkColors : LightColors;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDuration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function SessionCard({ session }: { session: SessionLog }) {
  const exerciseCount = session.exerciseLogs?.length ?? 0;
  const totalSets = session.exerciseLogs?.reduce((sum, log) => sum + (log.completedSets ?? 0), 0) ?? 0;
  const duration = formatDuration(session.startedAt, session.completedAt);
  const workoutName = session.workoutDay?.name ?? 'Workout';

  return (
    <View style={sessionStyles.card}>
      <View style={sessionStyles.header}>
        <View style={sessionStyles.iconWrapper}>
          <Text style={sessionStyles.icon}>💪</Text>
        </View>
        <View style={sessionStyles.headerText}>
          <Text style={sessionStyles.workoutName}>{workoutName}</Text>
          <Text style={sessionStyles.date}>{formatDate(session.startedAt)}</Text>
        </View>
        <View style={sessionStyles.durationBadge}>
          <Text style={sessionStyles.durationText}>{duration}</Text>
        </View>
      </View>

      <View style={sessionStyles.statsRow}>
        <View style={sessionStyles.stat}>
          <Text style={sessionStyles.statValue}>{exerciseCount}</Text>
          <Text style={sessionStyles.statLabel}>Exercises</Text>
        </View>
        <View style={sessionStyles.statDivider} />
        <View style={sessionStyles.stat}>
          <Text style={sessionStyles.statValue}>{totalSets}</Text>
          <Text style={sessionStyles.statLabel}>Sets</Text>
        </View>
        <View style={sessionStyles.statDivider} />
        <View style={sessionStyles.stat}>
          <Text style={[sessionStyles.statValue, { color: C.health }]}>Done</Text>
          <Text style={sessionStyles.statLabel}>Status</Text>
        </View>
      </View>
    </View>
  );
}

const sessionStyles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(143,111,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: { fontSize: 20 },
  headerText: { flex: 1 },
  workoutName: { fontSize: 16, fontWeight: '700', color: C.foreground, letterSpacing: -0.32 },
  date: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
  durationBadge: {
    backgroundColor: 'rgba(143,111,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(143,111,255,0.20)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
  },
  durationText: { fontSize: 12, fontWeight: '700', color: C.brand },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '800', color: C.foreground, letterSpacing: -0.36 },
  statLabel: { fontSize: 11, color: C.textTertiary, fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: C.border },
});

export default function HistoryScreen(): React.JSX.Element {
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSessions(): Promise<void> {
      try {
        const data = await api.getSessions();
        if (isMounted) setSessions(data as SessionLog[]);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load history.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadSessions();
    return () => { isMounted = false; };
  }, [api]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={C.brand} size="large" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.kicker}>YOUR PROGRESS</Text>
          <Text style={styles.title}>Workout History</Text>
          <Text style={styles.subtitle}>Every session logged, every rep counted.</Text>
        </View>

        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <LinearGradient
            colors={['#1B1840', '#12102A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsBannerGradient}
          >
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>{sessions.length}</Text>
              <Text style={styles.statsLabel}>Sessions</Text>
            </View>
            <View style={styles.statsItemDivider} />
            <View style={styles.statsItem}>
              <Text style={[styles.statsValue, { color: C.health }]}>
                {sessions.length > 0 ? '🔥' : '—'}
              </Text>
              <Text style={styles.statsLabel}>Streak</Text>
            </View>
            <View style={styles.statsItemDivider} />
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>
                {sessions.reduce(
                  (sum, s) => sum + (s.exerciseLogs?.reduce((a, l) => a + (l.completedSets ?? 0), 0) ?? 0),
                  0,
                )}
              </Text>
              <Text style={styles.statsLabel}>Total Sets</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Session List or Empty State */}
        {errorMessage ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⚠️</Text>
            <Text style={styles.emptyTitle}>Couldn't load history</Text>
            <Text style={styles.emptyText}>{errorMessage}</Text>
          </View>
        ) : sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyText}>
              Complete your first workout to start building your history.
            </Text>
          </View>
        ) : (
          sessions.map((session) => <SessionCard key={session.id} session={session} />)
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  content: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.background,
    gap: 16,
  },
  loadingText: { fontSize: 15, color: C.textSecondary, fontWeight: '500' },
  header: { marginBottom: 20 },
  kicker: { fontSize: 11, fontWeight: '700', color: C.textTertiary, letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '800', color: C.foreground, letterSpacing: -0.52, marginBottom: 4 },
  subtitle: { fontSize: 14, color: C.textSecondary, lineHeight: 22 },
  statsBanner: { borderRadius: 20, overflow: 'hidden', marginBottom: 24, borderWidth: 1, borderColor: C.border },
  statsBannerGradient: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  statsItem: { flex: 1, alignItems: 'center' },
  statsValue: { fontSize: 24, fontWeight: '900', color: C.foreground },
  statsLabel: { fontSize: 11, fontWeight: '600', color: C.textTertiary, marginTop: 4 },
  statsItemDivider: { width: 1, height: 40, backgroundColor: C.border },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyIcon: { fontSize: 44, marginBottom: 4 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: C.foreground, textAlign: 'center' },
  emptyText: { fontSize: 15, color: C.textSecondary, textAlign: 'center', lineHeight: 23 },
});
