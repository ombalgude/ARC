import { create } from 'zustand';
import { LightColors, DarkColors } from '../../../packages/ui/src/tokens/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light', // Default to light mode as requested
  toggleTheme: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
  setTheme: (mode) => set({ mode }),
}));

export const useAppTheme = () => {
  const mode = useThemeStore((state) => state.mode);
  return mode === 'dark' ? DarkColors : LightColors;
};
