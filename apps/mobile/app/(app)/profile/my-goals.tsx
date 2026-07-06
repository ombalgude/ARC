import { useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Flame, Dumbbell, Zap, Home, Building2, AlertTriangle, Scale, UtensilsCrossed } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo';
import { useAppTheme } from '../../../lib/themeStore';
import { createApiClient } from '../../../lib/api';

const GOALS = [
  { id: 'lose_fat', icon: Flame, label: 'Lose Fat', color: '#FF6B6B', colors: ['#FF6B6B', '#FF4444'] as const },
  { id: 'maintain', icon: Scale, label: 'Maintain', color: '#00D9B8', colors: ['#00D9B8', '#06B6D4'] as const },
  { id: 'build_muscle', icon: Dumbbell, label: 'Build Muscle', color: '#7C5CFC', colors: ['#7C5CFC', '#A07AF8'] as const },
];

const DIETS = [
  { id: 'non-veg', label: 'Non-Veg' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'eggetarian', label: 'Eggetarian' },
  { id: 'no-preference', label: 'No Preference' },
];

const SPLITS = [
  { id: 3, label: '3-Day Split', sub: '3 sessions/week' },
  { id: 4, label: '4-Day Split', sub: '4 sessions/week' },
  { id: 5, label: '5-Day Split', sub: '5 sessions/week' },
  { id: 6, label: '6-Day Split', sub: '6 sessions/week' },
];

export default function MyGoalsScreen() {
  const C = useAppTheme();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(async () => await getToken()), [getToken]);
  const queryClient = useQueryClient();

  const { data: meData, isLoading: isMeLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.getMe(),
  });

  const [goal, setGoal] = useState('build_muscle');
  const [split, setSplit] = useState(4);
  const [env, setEnv] = useState<'gym' | 'home'>('gym');
  const [diet, setDiet] = useState('no-preference');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (meData?.profile) {
      setGoal((meData.profile.goal as string) === 'losefat' ? 'lose_fat' : ((meData.profile.goal as string) === 'maintain' ? 'maintain' : 'build_muscle'));
      setSplit((meData.profile.workoutDaysPerWeek as number) || 4);
      setDiet((meData.profile.dietaryPreference as string) || 'no-preference');
    }
    if (meData?.preferences) {
      setEnv((meData.preferences.preferredEnvironment as 'gym' | 'home') || 'gym');
    }
  }, [meData]);

  const mutation = useMutation({
    mutationFn: (input: { goal: string; workoutDaysPerWeek: number; environment: string; dietaryPreference: string }) => api.regeneratePlan(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setShowConfirm(false);
      router.navigate('/dashboard' as any);
    },
    onError: (error) => {
      console.error('Failed to regenerate plan:', error);
      alert('Failed to regenerate plan. Please try again.');
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ChevronLeft size={24} color={C.foreground} />
        </Pressable>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground }}>My Goals</Text>
      </View>

      {isMeLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.brand} size="large" />
        </View>
      ) : (
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        
        {/* Goal */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Primary Goal</Text>
        <View style={{ gap: 10, marginBottom: 24 }}>
          {GOALS.map(({ id, icon: Icon, label, color, colors }) => {
            const active = goal === id;
            return (
              <Pressable
                key={id}
                onPress={() => setGoal(id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  padding: 16,
                  backgroundColor: active ? `${color}15` : C.card,
                  borderWidth: 2,
                  borderColor: active ? color : C.border,
                  borderRadius: 16,
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 12, overflow: 'hidden' }}>
                  {active ? (
                    <LinearGradient colors={colors} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color="#FFF" />
                    </LinearGradient>
                  ) : (
                    <View style={{ flex: 1, backgroundColor: C.muted, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color={C.textTertiary} />
                    </View>
                  )}
                </View>
                <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: active ? color : C.foreground }}>{label}</Text>
                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: active ? color : C.border, backgroundColor: active ? color : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  {active && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF' }} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Split */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Training Split</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
          {SPLITS.map(({ id, label, sub }) => {
            const active = split === id;
            return (
              <Pressable
                key={id}
                onPress={() => setSplit(id)}
                style={{
                  width: '48%',
                  padding: 14,
                  backgroundColor: active ? `${C.brand}15` : C.card,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: active ? C.brand : C.border,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: active ? C.brand : C.foreground }}>{label}</Text>
                <Text style={{ fontSize: 11, color: C.textTertiary, marginTop: 4 }}>{sub}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Environment */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Training Environment</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {([{ id: 'gym' as const, icon: Building2, label: 'Gym' }, { id: 'home' as const, icon: Home, label: 'Home' }]).map(({ id, icon: Icon, label }) => {
            const active = env === id;
            return (
              <Pressable
                key={id}
                onPress={() => setEnv(id)}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: 15,
                  backgroundColor: active ? `${C.brand}15` : C.card,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: active ? C.brand : C.border,
                }}
              >
                <Icon size={18} color={active ? C.brand : C.textSecondary} strokeWidth={2} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: active ? C.brand : C.foreground }}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
        
        {/* Diet */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <UtensilsCrossed size={14} color={C.textTertiary} />
          <Text style={{ fontSize: 11, fontWeight: '700', color: C.textTertiary, textTransform: 'uppercase', letterSpacing: 1 }}>Dietary Preference</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 20 }}>
          {DIETS.map(({ id, label }) => {
            const active = diet === id;
            return (
              <Pressable
                key={id}
                onPress={() => setDiet(id)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: active ? `${C.brand}15` : C.card,
                  borderRadius: 99,
                  borderWidth: 1.5,
                  borderColor: active ? C.brand : C.border,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: active ? C.brand : C.foreground }}>{label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          onPress={() => setShowConfirm(true)}
          style={{ overflow: 'hidden', borderRadius: 16 }}
        >
          <LinearGradient
            colors={['#7C5CFC', '#A07AF8']}
            style={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>Save & Regenerate Plan</Text>
          </LinearGradient>
        </Pressable>

      </ScrollView>
      )}

      {/* Confirmation Modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => !mutation.isPending && setShowConfirm(false)} />
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, marginTop: 'auto' }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 20 }} />
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,179,0,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={22} color="#FFB300" />
              </View>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: C.foreground }}>Regenerate your plan?</Text>
                <Text style={{ fontSize: 14, color: C.textSecondary, marginTop: 4 }}>This creates a new workout plan based on your goals.</Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                mutation.mutate({ goal, workoutDaysPerWeek: split, environment: env, dietaryPreference: diet });
              }}
              disabled={mutation.isPending}
              style={{ overflow: 'hidden', borderRadius: 14, marginBottom: 10 }}
            >
              <LinearGradient colors={['#7C5CFC', '#A07AF8']} style={{ padding: 16, alignItems: 'center' }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                {mutation.isPending ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>Yes, Regenerate Plan</Text>
                )}
              </LinearGradient>
            </Pressable>
            
            <Pressable
              onPress={() => setShowConfirm(false)}
              disabled={mutation.isPending}
              style={{ padding: 16, alignItems: 'center', backgroundColor: C.muted, borderRadius: 14, opacity: mutation.isPending ? 0.5 : 1 }}
            >
              <Text style={{ color: C.textSecondary, fontSize: 16, fontWeight: '700' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
