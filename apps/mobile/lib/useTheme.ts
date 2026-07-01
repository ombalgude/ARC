import { useColorScheme } from 'react-native';
import { DarkColors, LightColors } from '../../../packages/ui/src/tokens/theme';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return {
    colors: isDark ? DarkColors : LightColors,
    isDark,
  };
}
