import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Sun, Moon, Monitor, Bell, ChevronRight, LogOut, Trash2 } from 'lucide-react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useAppTheme, useThemeStore } from '../../../lib/themeStore';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const C = useAppTheme();
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 11, fontWeight: '800', color: C.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingHorizontal: 4 }}>
        {title}
      </Text>
      <View style={{ backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
}

function Row({ label, sub, left, right, divider = true }: { label: string; sub?: string; left?: React.ReactNode; right?: React.ReactNode; divider?: boolean }) {
  const C = useAppTheme();
  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 }}>
        {left && left}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground }}>{label}</Text>
          {sub && <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 2 }}>{sub}</Text>}
        </View>
        {right}
      </View>
      {divider && <View style={{ height: 1, backgroundColor: C.border, marginLeft: left ? 46 : 16 }} />}
    </>
  );
}

export default function SettingsScreen() {
  const C = useAppTheme();
  const { signOut } = useAuth();
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setTheme);
  
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [notifs, setNotifs] = useState({ workout: true, habit: true, nutrition: false, streak: true, weekly: true });

  const NOTIF_ROWS = [
    { key: 'workout' as const, label: 'Workout Reminders', sub: 'Daily at 7:00 AM' },
    { key: 'habit' as const, label: 'Habit Reminders', sub: 'Daily at 8:00 PM' },
    { key: 'nutrition' as const, label: 'Nutrition Reminders', sub: 'Daily at 12:00 PM' },
    { key: 'streak' as const, label: 'Streak Alerts', sub: "When you're at risk" },
    { key: 'weekly' as const, label: 'Weekly Summary', sub: 'Every Sunday' },
  ];

  const handleSignOut = () => void signOut();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ChevronLeft size={24} color={C.foreground} />
        </Pressable>
        <Text style={{ fontSize: 24, fontWeight: '800', color: C.foreground }}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Appearance */}
        <Section title="Appearance">
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.foreground, marginBottom: 12 }}>Theme</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[
                { id: 'light' as const, icon: Sun, label: 'Light' },
                { id: 'dark' as const, icon: Moon, label: 'Dark' },
              ].map(({ id, icon: Icon, label }) => {
                const active = themeMode === id;
                return (
                  <Pressable
                    key={id}
                    onPress={() => setThemeMode(id)}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      gap: 8,
                      paddingVertical: 12,
                      backgroundColor: active ? `${C.brand}15` : C.muted,
                      borderRadius: 14,
                      borderWidth: 1.5,
                      borderColor: active ? C.brand : 'transparent',
                    }}
                  >
                    <Icon size={18} color={active ? C.brand : C.textSecondary} strokeWidth={active ? 2.5 : 1.8} />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: active ? C.brand : C.textSecondary }}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Section>

        {/* Units */}
        <Section title="Units">
          <Row
            label="Measurement System"
            sub={units === 'metric' ? 'Metric · kg, cm' : 'Imperial · lbs, ft'}
            right={
              <View style={{ flexDirection: 'row', backgroundColor: C.muted, borderRadius: 10, padding: 3, gap: 2 }}>
                {(['metric', 'imperial'] as const).map((u) => (
                  <Pressable
                    key={u}
                    onPress={() => setUnits(u)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      backgroundColor: units === u ? C.card : 'transparent',
                      shadowColor: '#000',
                      shadowOffset: units === u ? { width: 0, height: 1 } : { width: 0, height: 0 },
                      shadowOpacity: units === u ? 0.05 : 0,
                      shadowRadius: 2,
                      elevation: units === u ? 1 : 0,
                    }}
                  >
                    <Text style={{ color: units === u ? C.foreground : C.textTertiary, fontSize: 13, fontWeight: '700' }}>
                      {u === 'metric' ? 'kg' : 'lbs'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            }
            divider={false}
          />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          {NOTIF_ROWS.map(({ key, label, sub }, i) => (
            <Row
              key={key}
              label={label}
              sub={sub}
              left={<Bell size={16} color={C.textTertiary} strokeWidth={1.8} />}
              right={
                <Switch
                  value={notifs[key]}
                  onValueChange={(val) => setNotifs(p => ({ ...p, [key]: val }))}
                  trackColor={{ false: C.muted, true: C.brand }}
                  thumbColor="#FFFFFF"
                />
              }
              divider={i < NOTIF_ROWS.length - 1}
            />
          ))}
        </Section>

        {/* Account */}
        <Section title="Account">
          {[
            { label: "Edit Profile", sub: "Name, email, photo" },
            { label: "Change Password", sub: "Update your credentials" },
            { label: "Data & Privacy", sub: "Manage your data" },
          ].map(({ label, sub }, i, arr) => (
            <Row
              key={label}
              label={label}
              sub={sub}
              right={<ChevronRight size={16} color={C.textTertiary} />}
              divider={i < arr.length - 1}
            />
          ))}
        </Section>

        {/* Danger */}
        <View style={{ gap: 12, marginTop: 8 }}>
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: 16,
                backgroundColor: C.muted,
                borderRadius: 14,
              },
              pressed && { opacity: 0.8 }
            ]}
          >
            <LogOut size={18} color={C.textSecondary} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.textSecondary }}>Sign Out</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: 16,
                backgroundColor: 'rgba(255,68,68,0.08)',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: 'rgba(255,68,68,0.2)',
              },
              pressed && { opacity: 0.8 }
            ]}
          >
            <Trash2 size={18} color={C.destructive} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.destructive }}>Delete Account</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
