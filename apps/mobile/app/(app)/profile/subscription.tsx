import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Check, Sparkles, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../lib/themeStore';

const PRO = ["Unlimited AI coaching conversations", "Advanced analytics & insights", "Custom workout builder", "Nutrition coaching & meal ideas", "Priority plan generation", "Progress photo tracking", "Priority support"];
const FREE_FEATS = ["1 AI conversation/day", "Personalized workout plan", "Basic habit tracking", "Nutrition targets"];

export default function SubscriptionScreen() {
  const C = useAppTheme();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ChevronLeft size={24} color={C.foreground} />
        </Pressable>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground }}>Subscription</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: C.muted, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 20 }}>
          <Text style={{ fontSize: 24 }}>⚡</Text>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground }}>Currently on Free Plan</Text>
            <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>Upgrade to unlock all features</Text>
          </View>
        </View>

        <View style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 24, elevation: 8, shadowColor: '#7C5CFC', shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } }}>
          <LinearGradient colors={['#3A20C0', '#7C5CFC', '#A07AF8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 24 }}>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Sparkles size={20} color="#FFF" />
              <Text style={{ fontSize: 16, fontWeight: '800', color: 'rgba(255,255,255,0.95)', letterSpacing: 1, textTransform: 'uppercase' }}>Arc Pro</Text>
            </View>

            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 4, gap: 4, marginBottom: 16 }}>
              {([['monthly', 'Monthly', '$9.99/mo'] as const, ['annual', 'Annual', '$5.99/mo'] as const]).map(([id, label, price]) => (
                <Pressable
                  key={id}
                  onPress={() => setPlan(id)}
                  style={{ flex: 1, paddingVertical: 12, borderRadius: 11, backgroundColor: plan === id ? '#FFF' : 'transparent', alignItems: 'center' }}
                >
                  <Text style={{ color: plan === id ? '#7C5CFC' : 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '800' }}>{label}</Text>
                  <Text style={{ color: plan === id ? '#7C5CFC' : 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600', marginTop: 2 }}>{price}</Text>
                </Pressable>
              ))}
            </View>

            {plan === 'annual' && (
              <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 20 }}>
                <Zap size={14} color="#FFD700" fill="#FFD700" />
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#FFD700' }}>Save 40% — $71.88/year</Text>
              </View>
            )}

            <View style={{ gap: 12, marginBottom: 24 }}>
              {PRO.map((f) => (
                <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="#FFF" strokeWidth={3} />
                  </View>
                  <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.95)', fontWeight: '500' }}>{f}</Text>
                </View>
              ))}
            </View>

            <Pressable style={{ width: '100%', padding: 16, backgroundColor: '#FFF', borderRadius: 16, alignItems: 'center' }}>
              <Text style={{ color: '#7C5CFC', fontSize: 16, fontWeight: '800' }}>Start 7-Day Free Trial</Text>
            </Pressable>

          </LinearGradient>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '800', color: C.foreground, marginBottom: 12 }}>Free Plan Includes</Text>
        <View style={{ backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 20 }}>
          {FREE_FEATS.map((f, i) => (
            <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: i === FREE_FEATS.length - 1 ? 0 : 12 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.muted, alignItems: 'center', justifyContent: 'center' }}>
                <Check size={12} color={C.textTertiary} strokeWidth={3} />
              </View>
              <Text style={{ fontSize: 14, color: C.textSecondary, fontWeight: '500' }}>{f}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 13, color: C.textTertiary, textAlign: 'center', fontWeight: '500' }}>Cancel anytime. No charges during trial.</Text>
      </ScrollView>

    </SafeAreaView>
  );
}
