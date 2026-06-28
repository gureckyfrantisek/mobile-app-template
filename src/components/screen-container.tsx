import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import type { ThemedViewProps } from '@/components/themed-view';
import { ThemedView } from '@/components/themed-view';

export function ScreenContainer({ style, ...rest }: ThemedViewProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <ThemedView style={[styles.container, style]} {...rest} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 16 },
});