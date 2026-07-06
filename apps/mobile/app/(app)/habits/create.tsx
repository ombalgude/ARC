import { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react-native';

import { createApiClient } from '../../../lib/api';
import { useAppTheme } from '../../../lib/themeStore';

const TEMPLATES = [
  { id: 'water', name: "Drink Water", targetValue: "8", unit: "glasses", colorHex: "#06B6D4" },
  { id: 'sleep', name: "Quality Sleep", targetValue: "8", unit: "hours", colorHex: "#7C5CFC" },
  { id: 'steps', name: "10k Steps", targetValue: "10000", unit: "steps", colorHex: "#FF6B6B" },
  { id: 'workout', name: "Workout", targetValue: "", unit: "", colorHex: "#00D9B8" },
  { id: 'diet', name: "Healthy Diet", targetValue: "", unit: "", colorHex: "#FFB300" },
];

export default function CreateHabitScreen() {
  const C = useAppTheme();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [colorHex, setColorHex] = useState<string>(C.brand);

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setName(tpl.name);
    setTarget(tpl.targetValue);
    setUnit(tpl.unit);
    setColorHex(tpl.colorHex);
  };

  const { mutate: createHabit, isPending } = useMutation({
    mutationFn: async () => {
      const targetVal = target.trim() ? Number(target.trim()) : undefined;
      return api.createHabit({
        name: name.trim(),
        targetValue: targetVal,
        unit: unit.trim() || undefined,
        colorHex,
      });
    },
    onSuccess: () => {
      const now = new Date();
      const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      queryClient.invalidateQueries({ queryKey: ['habits-detail', localDate] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-habits', localDate] });
      router.back();
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to create habit');
    }
  });

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter a habit name");
      return;
    }
    createHabit();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <Pressable hitSlop={12} onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ChevronLeft size={28} color={C.foreground} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>
          Create Habit
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Templates Section */}
        <View style={{ marginTop: 8, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.foreground, paddingHorizontal: 20, marginBottom: 12 }}>
            Quick Templates
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {TEMPLATES.map((tpl) => {
              return (
                <Pressable
                  key={tpl.id}
                  onPress={() => applyTemplate(tpl)}
                  style={({ pressed }) => [
                    {
                      width: 100,
                      paddingVertical: 16,
                      paddingHorizontal: 12,
                      backgroundColor: C.card,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: C.border,
                      alignItems: 'center',
                      gap: 8,
                    },
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.foreground, textAlign: 'center' }}>
                    {tpl.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 20 }}>
          {/* Customization Preview */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8, paddingLeft: 4 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.foreground }}>
                {name || "Your Custom Habit"}
              </Text>
              <Text style={{ fontSize: 14, color: C.textSecondary, marginTop: 2 }}>
                {target ? `Target: ${target} ${unit}` : "Daily habit"}
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.textSecondary, marginLeft: 4 }}>
              Habit Name
            </Text>
            <TextInput
              style={{
                backgroundColor: C.card,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                color: C.foreground,
              }}
              placeholder="e.g. Meditate"
              placeholderTextColor={C.textTertiary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.textSecondary, marginLeft: 4 }}>
                Target (Optional)
              </Text>
              <TextInput
                style={{
                  backgroundColor: C.card,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: C.foreground,
                }}
                placeholder="e.g. 10"
                placeholderTextColor={C.textTertiary}
                keyboardType="numeric"
                value={target}
                onChangeText={setTarget}
              />
            </View>

            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.textSecondary, marginLeft: 4 }}>
                Unit (Optional)
              </Text>
              <TextInput
                style={{
                  backgroundColor: C.card,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: C.foreground,
                }}
                placeholder="e.g. mins"
                placeholderTextColor={C.textTertiary}
                value={unit}
                onChangeText={setUnit}
              />
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: C.background, borderTopWidth: 1, borderTopColor: C.border }}>
        <Pressable
          onPress={handleSave}
          disabled={isPending}
          style={({ pressed }) => [
            {
              backgroundColor: C.brand,
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            },
            pressed && { opacity: 0.8 },
            isPending && { opacity: 0.5 }
          ]}
        >
          {isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>
              Create Habit
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
