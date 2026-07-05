import { useAuth } from '@clerk/clerk-expo';
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
import { CheckCircle2, ChevronLeft, Clock, X } from 'lucide-react-native';

import { createApiClient, type SessionLog } from '../../lib/api';
import { useAppTheme } from '../../lib/themeStore';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}



function getWeekLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  
  // reset times to midnight for accurate day diff
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (diffDays <= 7) return "This week";
  if (diffDays <= 14) return "Last week";
  if (diffDays <= 21) return "2 weeks ago";
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}



export default function HistoryScreen(): React.JSX.Element {
  const C = useAppTheme();
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

  // Transform actual data
  const historyItems = useMemo(() => {
    return sessions
      .filter(session => session.completedAt != null)
      .map(session => {
        const sets = session.exerciseLogs?.length ?? 0;
        return {
          date: formatDate(session.completedAt!),
          name: session.workoutDay?.name ?? 'Workout',
          sets,
          status: "done",
          week: getWeekLabel(session.completedAt!)
        };
      });
  }, [sessions]);

  const completed = historyItems.filter((h) => h.status === "done").length;
  const nonRest = historyItems.filter((h) => h.status !== "rest").length;
  const completionRate = nonRest > 0 ? Math.round((completed / nonRest) * 100) : 0;
  
  // Group by week
  const grouped = historyItems.reduce((acc, item) => {
    const list = acc[item.week] || [];
    list.push(item);
    acc[item.week] = list;
    return acc;
  }, {} as Record<string, typeof historyItems>);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.background }}>
        <ActivityIndicator color={C.brand} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8, marginLeft: -8, marginRight: 8 }}>
          <ChevronLeft size={24} color={C.foreground} strokeWidth={2.5} />
        </Pressable>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>
          Workout History
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        
        {errorMessage && (
          <View style={{ marginHorizontal: 20, marginBottom: 16, padding: 12, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12 }}>
            <Text style={{ color: '#EF4444', fontSize: 13, textAlign: 'center' }}>{errorMessage}</Text>
          </View>
        )}

        {/* Stats summary */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 20 }}>
          {[
            { label: "Completed", value: completed, color: "#14C9A4" },
            { label: "Completion Rate", value: `${completionRate}%`, color: "#7665F5" },
          ].map(({ label, value, color }) => (
            <View
              key={label}
              style={{
                backgroundColor: C.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: C.border,
                minWidth: 110,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '800', color, letterSpacing: -0.5 }}>{value}</Text>
              <Text style={{ fontSize: 11, color: C.textTertiary, fontWeight: '600', marginTop: 4 }}>{label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* History list */}
        <View style={{ paddingHorizontal: 20 }}>
          {historyItems.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🏃</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.foreground, marginBottom: 8 }}>No workouts yet!</Text>
              <Text style={{ fontSize: 14, color: C.textSecondary, textAlign: 'center' }}>
                Complete a workout to see it appear in your history.
              </Text>
            </View>
          ) : (
            Object.entries(grouped).map(([week, items]) => (
              <View key={week} style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  {week}
                </Text>
                <View style={{ gap: 8 }}>
                  {items.map(({ date, name, sets, status }, idx) => (
                    <View
                      key={`${date}-${idx}`}
                      style={{
                        backgroundColor: status === "missed" ? 'rgba(239,68,68,0.04)' : C.card,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: status === "missed" ? 'rgba(239,68,68,0.15)' : C.border,
                        padding: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.03,
                        shadowRadius: 4,
                        elevation: 1,
                      }}
                    >
                      {/* Status Icon */}
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          backgroundColor: status === "done" ? 'rgba(0, 217, 184, 0.12)' : status === "rest" ? C.muted : 'rgba(239,68,68,0.1)',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {status === "done" ? (
                          <CheckCircle2 size={18} color={C.health} strokeWidth={2.5} />
                        ) : status === "rest" ? (
                          <Text style={{ fontSize: 14 }}>🌙</Text>
                        ) : (
                          <X size={18} color="#EF4444" strokeWidth={2.5} />
                        )}
                      </View>

                      {/* Details */}
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground }}>{name}</Text>
                        <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 2 }}>{date}</Text>
                      </View>

                      {/* Meta stats */}
                      {status === "done" && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={{ backgroundColor: C.muted, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 }}>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: C.textTertiary }}>{sets} sets</Text>
                          </View>
                        </View>
                      )}

                      {status === "missed" && (
                        <View style={{ backgroundColor: 'rgba(239,68,68,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 }}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: '#EF4444' }}>Missed</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
