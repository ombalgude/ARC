import { useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Trash2 } from 'lucide-react-native';

import { createApiClient, HabitSummary } from '../../../lib/api';
import { useAppTheme } from '../../../lib/themeStore';

export default function EditHabitScreen() {
  const C = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const queryClient = useQueryClient();

  const now = new Date();
  const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Retrieve the habit from cache
  const cachedHabits = queryClient.getQueryData<HabitSummary[]>(['habits-detail', localDate]) || [];
  const habit = cachedHabits.find(h => h.id === id);

  const { mutate: removeHabit, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Missing habit ID");
      return api.deleteHabit(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits-detail', localDate] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-habits', localDate] });
      router.back();
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to delete habit');
    }
  });

  const confirmDelete = () => {
    if (!habit) return;
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habit.type || 'this habit'}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => removeHabit() }
      ]
    );
  };

  if (!habit) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.textSecondary, marginBottom: 16 }}>Habit not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: C.brand, fontWeight: '600' }}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const name = habit.type || 'Habit';
  const color = habit.colorHex || C.brand;

  const [editName, setEditName] = useState(name);
  const [editTarget, setEditTarget] = useState(habit.targetValue || '');
  const [editUnit, setEditUnit] = useState(habit.unit || '');

  const { mutate: updateHabit, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Missing habit ID");
      return api.updateHabit(id, {
        name: editName.trim(),
        targetValue: editTarget ? Number(editTarget) : undefined,
        unit: editUnit.trim() || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits-detail', localDate] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-habits', localDate] });
      router.back();
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'Failed to update habit');
    }
  });

  const handleSave = () => {
    if (!editName.trim()) {
      Alert.alert('Required', 'Please enter a habit name');
      return;
    }
    updateHabit();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <Pressable hitSlop={12} onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ChevronLeft size={28} color={C.foreground} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '800', color: C.foreground, letterSpacing: -0.5 }}>
          Edit Habit
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}>
        
        {/* Habit Preview Banner */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: 16, 
          padding: 20, 
          backgroundColor: C.card, 
          borderRadius: 20,
          borderWidth: 1,
          borderColor: C.border,
          marginBottom: 32
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: C.foreground }}>
              {name}
            </Text>
            <Text style={{ fontSize: 14, color: C.textSecondary, marginTop: 4 }}>
              {habit.targetValue ? `Target: ${habit.targetValue} ${habit.unit || ''}` : "Daily habit"}
            </Text>
          </View>
        </View>

        {/* Edit Controls */}
        <View style={{ gap: 20, marginBottom: 40 }}>
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
                padding: 16,
                fontSize: 16,
                color: C.foreground,
                fontWeight: '600',
              }}
              value={editName}
              onChangeText={setEditName}
              placeholder="e.g. Drink Water"
              placeholderTextColor={C.textTertiary}
            />
          </View>
          
          <View style={{ flexDirection: 'row', gap: 16 }}>
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
                  padding: 16,
                  fontSize: 16,
                  color: C.foreground,
                  fontWeight: '600',
                }}
                value={editTarget}
                onChangeText={setEditTarget}
                placeholder="e.g. 8"
                placeholderTextColor={C.textTertiary}
                keyboardType="numeric"
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
                  padding: 16,
                  fontSize: 16,
                  color: C.foreground,
                  fontWeight: '600',
                }}
                value={editUnit}
                onChangeText={setEditUnit}
                placeholder="e.g. glasses"
                placeholderTextColor={C.textTertiary}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <Pressable
          onPress={handleSave}
          disabled={isUpdating || isDeleting}
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
            (isUpdating || isDeleting) && { opacity: 0.5 }
          ]}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>
              Save Changes
            </Text>
          )}
        </Pressable>
      </View>

      {/* Danger Zone: Bottom Button */}
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: C.border }}>
        <Pressable
          onPress={confirmDelete}
          disabled={isDeleting}
          style={({ pressed }) => [
            {
              backgroundColor: '#FF3B30',
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            },
            pressed && { opacity: 0.8 },
            isDeleting && { opacity: 0.5 }
          ]}
        >
          {isDeleting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Trash2 size={20} color="#FFFFFF" />
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>
                Delete Habit
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
