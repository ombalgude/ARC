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
import { Weight, Target, CreditCard, Settings, ChevronRight, TrendingDown } from 'lucide-react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path, Circle } from 'react-native-svg';

import { createApiClient, type CurrentUserProfile } from '../../lib/api';
import { useAppTheme } from '../../lib/themeStore';

export default function ProfileScreen(): React.JSX.Element {
  const C = useAppTheme();
  
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  
  const [profileData, setProfileData] = useState<CurrentUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile(): Promise<void> {
      try {
        const result = await api.getMe();
        if (isMounted) setProfileData(result);
      } catch (error) {
        // silently fail and use fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    void loadProfile();
    return () => { isMounted = false; };
  }, [api]);

  const email = profileData?.user?.email || '';
  const name = email.split('@')[0] || 'Alex Chen';
  const initial = name.charAt(0).toUpperCase();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.brand} size="large" />
      </View>
    );
  }

  const MENU = [
    { label: "Weight Tracking", sub: "83.2kg → Goal: 80kg", Icon: Weight, color: "#00D9B8" },
    { label: "My Goals", sub: "Build Muscle · 4-day split", Icon: Target, color: "#7C5CFC" },
    { label: "Subscription", sub: "Free Plan — Upgrade to Pro", Icon: CreditCard, color: "#FFB300" },
    { label: "Settings", sub: "Theme, units, notifications", Icon: Settings, color: "#9890BC" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground, letterSpacing: -0.7 }}>
          Profile
        </Text>
        <Pressable hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} onPress={() => router.push('/profile/settings' as any)}>
          <Settings size={24} color={C.foreground} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        
        {/* Profile hero card */}
        <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
          <View
            style={{
              borderRadius: 24,
              overflow: 'hidden',
              backgroundColor: '#7C5CFC',
              shadowColor: '#7C5CFC',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.4,
              shadowRadius: 40,
              elevation: 10,
            }}
          >
            <LinearGradient
              colors={['#3A20C0', '#7C5CFC', '#9B7FFC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 20, position: 'relative' }}
            >
              {/* Decorative blobs */}
              <View style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.07)' }} />

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderWidth: 2,
                    borderColor: 'rgba(255,255,255,0.3)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFF' }}>{initial}</Text>
                </View>

                <View>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 }}>
                    {name}
                  </Text>
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                    {profileData?.profile?.goal ? String(profileData.profile.goal).replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase()) : 'Build Muscle'} · Intermediate
                  </Text>
                  
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 12 }}>🔥</Text>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFF' }}>14-day streak</Text>
                    </View>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFF' }}>Free Plan</Text>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 14 }}>
          {[
            { v: "14", label: "Workouts" },
            { v: "−1.8kg", label: "Lost" },
            { v: "88%", label: "Completion" },
          ].map(({ v, label }) => (
            <View
              key={label}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 14,
                backgroundColor: C.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: C.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>{v}</Text>
              <Text style={{ fontSize: 10, color: C.textTertiary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Weight chart mini */}
        <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: C.card,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: C.border,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
                overflow: 'hidden',
              },
              pressed && { transform: [{ scale: 0.98 }] }
            ]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.foreground }}>Weight Progress</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 }}>
                  <TrendingDown size={14} color={C.health} strokeWidth={2.5} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: C.health }}>−1.8 kg in 30 days</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 22, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>83.2</Text>
                <Text style={{ fontSize: 10, color: C.textTertiary, fontWeight: '600' }}>kg current</Text>
              </View>
            </View>

            <View style={{ height: 44, width: '100%' }}>
              <Svg width="100%" height="44" viewBox="0 0 300 44" preserveAspectRatio="none">
                <Defs>
                  <SvgLinearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={C.health} stopOpacity="0.25" />
                    <Stop offset="100%" stopColor={C.health} stopOpacity="0" />
                  </SvgLinearGradient>
                </Defs>
                <Path d="M0,36 C40,34 80,30 120,26 C160,22 200,20 240,17 L300,14 L300,44 L0,44 Z" fill="url(#wgrad)" />
                <Path d="M0,36 C40,34 80,30 120,26 C160,22 200,20 240,17 L300,14" stroke={C.health} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <Circle cx="300" cy="14" r="4" fill={C.health} />
              </Svg>
            </View>
          </Pressable>
        </View>

        {/* Menu */}
        <View style={{ gap: 8, paddingHorizontal: 20, marginTop: 14 }}>
          {MENU.map(({ label, sub, Icon, color }) => (
            <Pressable
              key={label}
              onPress={() => {
                router.push(('/profile/' + label.toLowerCase().replace(/ /g, '-')) as any);
              }}
              style={({ pressed }) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  padding: 14,
                  backgroundColor: C.card,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: C.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                },
                pressed && { transform: [{ scale: 0.98 }] }
              ]}
            >
              <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: `${color}15`, alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground }}>{label}</Text>
                <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 2 }}>{sub}</Text>
              </View>
              <ChevronRight size={16} color={C.textTertiary} />
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
