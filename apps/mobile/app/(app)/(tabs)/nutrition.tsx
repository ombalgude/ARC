import { useAuth } from '@clerk/clerk-expo';
import React, { useState, useMemo, useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Utensils, Coffee, Flame, Dumbbell, BookOpen, ChevronRight, Check } from 'lucide-react-native';
import { router } from 'expo-router';

import { createApiClient } from '../../../lib/api';
import { useAppTheme } from '../../../lib/themeStore';

function MacroBar({ label, current, target, color }: { label: string, current: number, target: number, color: string }) {
  const C = useAppTheme();
  const pct = target > 0 ? Math.min(1, current / target) : 0;
  
  const widthAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: pct * 100,
      tension: 60,
      friction: 10,
      useNativeDriver: false
    }).start();
  }, [pct]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: C.foreground }}>{label}</Text>
          {current >= target && target > 0 && <Check size={14} color={color} strokeWidth={3} />}
        </View>
        <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>
          <Text style={{ color: C.foreground }}>{current}g</Text> / {target}g
        </Text>
      </View>
      <View style={{ height: 6, backgroundColor: C.muted, borderRadius: 3, overflow: 'hidden' }}>
        <Animated.View style={[{ position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: color, borderRadius: 3, width: animatedWidth }]} />
      </View>
    </View>
  );
}

export default function NutritionScreen(): React.JSX.Element {
  const C = useAppTheme();
  
  const queryClient = useQueryClient();
  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.background },
    content: { padding: 20 },
    header: { marginBottom: 24 },
    title: { fontSize: 28, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 },
    subtitle: { fontSize: 13, color: C.textTertiary, marginTop: 4 },
  }), [C]);

  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  
  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.getMe(),
  });

  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  });

  const now = new Date();
  const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const { data: rawHabits } = useQuery({
    queryKey: ['habits-detail', localDate],
    queryFn: () => api.getHabits(localDate).then(res => res.habits),
  });

  const rawHabitsArray = Array.isArray(rawHabits) ? rawHabits : (rawHabits as any)?.habits || [];
  const getHabit = (type: string) => rawHabitsArray.find((h: any) => h.type === type);

  const { mutate: toggleHabit } = useMutation({
    mutationFn: async (habitId: string) => {
      const habit = rawHabitsArray.find((h: any) => h.id === habitId);
      const isDone = !(habit?.completedToday ?? false);
      return api.logHabit({ habitId, localDate, completed: isDone }).catch(() => null);
    },
    onMutate: async (habitId: string) => {
      await queryClient.cancelQueries({ queryKey: ['habits-detail', localDate] });
      const previousHabits = queryClient.getQueryData<any>(['habits-detail', localDate]);
      
      if (previousHabits) {
        queryClient.setQueryData<any>(['habits-detail', localDate], (old: any) => {
          const oldList = Array.isArray(old) ? old : (old?.habits || []);
          return oldList.map((h: any) => h.id === habitId ? { ...h, completedToday: !h.completedToday } : h);
        });
      }
      return { previousHabits };
    },
    onError: (err, newHabit, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits-detail', localDate], context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits-detail', localDate] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  if (meLoading || dashLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={C.brand} size="large" />
      </View>
    );
  }

  const nutrition = dashboard?.nutrition;
  const pref = (meData?.profile?.dietaryPreference as string) || 'non-veg';





  const completedPct = (dashboard?.mealSuggestions || []).reduce((sum, meal) => {
    const habit = getHabit(meal.id);
    return habit?.completedToday ? sum + meal.pct : sum;
  }, 0);

  const macrosList = [
    { label: "Protein", current: Math.round((nutrition?.proteinG || 0) * completedPct), target: nutrition?.proteinG || 0, color: "#7C5CFC" },
    { label: "Carbs", current: Math.round((nutrition?.carbsG || 0) * completedPct), target: nutrition?.carbsG || 0, color: "#00D9B8" },
    { label: "Fats", current: Math.round((nutrition?.fatG || 0) * completedPct), target: nutrition?.fatG || 0, color: "#FF6B6B" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Dietary Guide</Text>
          <Text style={styles.subtitle}>Goal: {nutrition?.goal ?? 'Build Muscle'} · Tailored for {pref}</Text>
        </View>

        {/* Diet Card */}
        <View style={{ backgroundColor: C.card, borderRadius: 22, borderWidth: 1, borderColor: C.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 3, marginBottom: 32 }}>
          <View style={{ padding: 18, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: C.foreground, letterSpacing: -0.2 }}>Diet</Text>
                <View style={{ paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'rgba(0,217,184,0.1)', borderRadius: 6 }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: '#00D9B8' }}>{nutrition?.caloriesTarget || 0} kcal</Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, color: C.textSecondary, fontWeight: '500' }}>
                Track your daily nutrition goals
              </Text>
            </View>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: `${C.brand}15`, alignItems: 'center', justifyContent: 'center' }}>
              <Utensils size={20} color={C.brand} />
            </View>
          </View>

          <View style={{ padding: 18, gap: 14 }}>
            {macrosList.map((macro) => (
              <MacroBar key={macro.label} {...macro} />
            ))}
          </View>

          {/* Quick Actions for Meals */}
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.border, backgroundColor: 'rgba(0,0,0,0.01)' }}>
            {[
              { type: 'meal_breakfast', label: 'Breakfast', icon: Coffee },
              { type: 'meal_lunch', label: 'Lunch', icon: Utensils },
              { type: 'meal_preworkout', label: 'Pre-W', icon: Flame },
              { type: 'meal_postworkout', label: 'Post-W', icon: Dumbbell }
            ].map(({ type, label, icon: Icon }) => {
              const habit = getHabit(type);
              const isDone = habit?.completedToday ?? false;
              
              return (
                <Pressable
                  key={type}
                  onPress={() => habit?.id && toggleHabit(habit.id)}
                  style={({ pressed }) => [{
                    flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center',
                    borderRightWidth: type !== 'meal_postworkout' ? 1 : 0, borderRightColor: C.border,
                    backgroundColor: isDone ? 'rgba(0,217,184,0.1)' : 'transparent',
                  }, pressed && { opacity: 0.7 }]}
                >
                  <Icon size={16} color={isDone ? '#00D9B8' : C.textTertiary} style={{ marginBottom: 4 }} />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: isDone ? '#00D9B8' : C.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Meal Suggestions */}
        <Text style={{ fontSize: 17, fontWeight: '800', color: C.foreground, marginBottom: 16 }}>Meal Structure</Text>
        <View style={{ gap: 12, marginBottom: 32 }}>
          {(dashboard?.mealSuggestions || []).map(({ id, time, when, focus, example, pct }) => (
            <View key={time} style={{ backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: C.foreground }}>{time}</Text>
                  <Text style={{ fontSize: 12, color: C.textTertiary, fontWeight: '500' }}>• {when}</Text>
                </View>
                <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: `${C.brand}15` }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: C.brand }}>{Math.round(pct * 100)}% MACROS</Text>
                </View>
              </View>
              
              <Text style={{ fontSize: 14, color: C.textSecondary, marginBottom: 4, lineHeight: 20 }}>
                <Text style={{ fontWeight: '600', color: C.foreground }}>Focus: </Text>
                {focus}
              </Text>
              <Text style={{ fontSize: 14, color: C.textSecondary, lineHeight: 20 }}>
                <Text style={{ fontWeight: '600', color: C.foreground }}>Try this: </Text>
                {example}
              </Text>
            </View>
          ))}
        </View>

        {/* Knowledge Base Link */}
        <Text style={{ fontSize: 17, fontWeight: '800', color: C.foreground, marginBottom: 16 }}>Learn</Text>
        <Pressable
          onPress={() => router.push('/nutrition/knowledge' as any)}
          style={({ pressed }) => [{
            backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 18,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          }, pressed && { opacity: 0.7 }]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: `${C.brand}15`, alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color={C.brand} />
            </View>
            <View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground, marginBottom: 2 }}>Nutrition Knowledge</Text>
              <Text style={{ fontSize: 12, color: C.textSecondary, fontWeight: '500' }}>Proteins, carbs, hydration & more</Text>
            </View>
          </View>
          <ChevronRight size={20} color={C.textTertiary} />
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}
