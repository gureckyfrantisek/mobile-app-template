import '@/i18n';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { PreferencesProvider, usePreferences } from '@/context/preferences';

function RootNavigator() {
  const { theme, hasOnboarded, isLoading } = usePreferences();
  const systemScheme = useColorScheme();

  const resolved = theme === 'system' ? (systemScheme ?? 'light') : theme;
  const colors = Colors[resolved as 'light' | 'dark'];

  if (isLoading) return null;

  return (
    <ThemeProvider value={resolved === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={resolved === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!hasOnboarded}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>
        <Stack.Protected guard={hasOnboarded}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <RootNavigator />
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}
