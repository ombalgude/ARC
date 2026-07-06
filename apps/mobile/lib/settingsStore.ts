import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UnitSystem = 'metric' | 'imperial';

interface SettingsState {
  units: UnitSystem;
  setUnits: (units: UnitSystem) => void;
  notifications: {
    workout: boolean;
    habit: boolean;
    nutrition: boolean;
    streak: boolean;
    weekly: boolean;
  };
  setNotification: (key: keyof SettingsState['notifications'], value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      units: 'metric',
      setUnits: (units) => set({ units }),
      notifications: {
        workout: true,
        habit: true,
        nutrition: false,
        streak: true,
        weekly: true,
      },
      setNotification: (key, value) => set((state) => ({
        notifications: {
          ...state.notifications,
          [key]: value,
        },
      })),
    }),
    {
      name: 'arc-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const kgToLbs = (kg: number): number => kg * 2.20462;
export const lbsToKg = (lbs: number): number => lbs / 2.20462;
export const cmToFtIn = (cm: number): { ft: number; in: number } => {
  const totalInches = cm / 2.54;
  return {
    ft: Math.floor(totalInches / 12),
    in: Math.round(totalInches % 12),
  };
};
