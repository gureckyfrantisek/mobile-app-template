import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { usePreferences } from '@/context/preferences';

export default function CompleteScreen() {
  const { t } = useTranslation();
  const { completeOnboarding } = usePreferences();

  function handleGetStarted() {
    completeOnboarding();
    router.replace('/(tabs)');
  }

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.center}>
          {t('onboarding.completeTitle')}
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.center}>
          {t('onboarding.completeSub')}
        </ThemedText>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <ThemedView type="backgroundSelected" style={styles.buttonInner}>
          <ThemedText type="smallBold">{t('onboarding.getStarted')}</ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', gap: 16 },
  center: { textAlign: 'center' },
  button: { marginTop: 16 },
  buttonInner: { padding: 16, borderRadius: 12, alignItems: 'center' },
});
