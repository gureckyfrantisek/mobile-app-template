import { useTranslation } from "react-i18next";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import {
  type AppLanguage,
  type AppTheme,
  usePreferences,
} from "@/context/preferences";
import { useTheme } from "@/hooks/use-theme";

function SectionHeader({ label }: { label: string }) {
  return (
    <ThemedText
      type="small"
      themeColor="textSecondary"
      style={styles.sectionHeader}
    >
      {label.toUpperCase()}
    </ThemedText>
  );
}

function OptionRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView type="backgroundElement" style={styles.row}>
        <ThemedText type="default">{label}</ThemedText>
        {selected && (
          <ThemedText style={[styles.check, { color: colors.highlight }]}>
            ✓
          </ThemedText>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, language, setTheme, setLanguage, resetOnboarding } =
    usePreferences();

  const themeOptions: { label: string; value: AppTheme }[] = [
    { label: t("settings.themeSystem"), value: "system" },
    { label: t("settings.themeLight"), value: "light" },
    { label: t("settings.themeDark"), value: "dark" },
  ];

  const languageOptions: { label: string; value: AppLanguage }[] = [
    { label: "English", value: "en" },
    { label: "Česky", value: "cs" },
  ];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader label={t("settings.theme")} />
        <View style={styles.group}>
          {themeOptions.map((opt, i) => (
            <View key={opt.value}>
              <OptionRow
                label={opt.label}
                selected={theme === opt.value}
                onPress={() => setTheme(opt.value)}
              />
              {i < themeOptions.length - 1 && <Divider />}
            </View>
          ))}
        </View>

        <SectionHeader label={t("settings.language")} />
        <View style={styles.group}>
          {languageOptions.map((opt, i) => (
            <View key={opt.value}>
              <OptionRow
                label={opt.label}
                selected={language === opt.value}
                onPress={() => setLanguage(opt.value)}
              />
              {i < languageOptions.length - 1 && <Divider />}
            </View>
          ))}
        </View>

        <SectionHeader label={t("settings.permissions")} />
        <View style={styles.group}>
          <TouchableOpacity onPress={() => Linking.openSettings()}>
            <ThemedView type="backgroundElement" style={styles.row}>
              <ThemedText type="default">
                {t("settings.appPermissions")}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                ›
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </View>

        <SectionHeader label="DEBUG" />
        <View style={styles.group}>
          <TouchableOpacity onPress={resetOnboarding}>
            <ThemedView type="backgroundElement" style={styles.row}>
              <ThemedText type="default" style={styles.destructive}>
                Reset onboarding
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Divider() {
  return <ThemedView type="backgroundSelected" style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: { padding: Spacing.three, gap: Spacing.one },
  sectionHeader: {
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
    marginLeft: Spacing.two,
  },
  group: { borderRadius: 12, overflow: "hidden" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.three,
  },
  check: { fontSize: 18, fontWeight: "600" },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: Spacing.three },
  destructive: { color: "#ff4444" },
});
