import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/preferences';

export function useTheme() {
  const { theme } = usePreferences();
  const systemScheme = useColorScheme();
  const resolved = theme === 'system' ? (systemScheme ?? 'light') : theme;
  return Colors[resolved];
}
