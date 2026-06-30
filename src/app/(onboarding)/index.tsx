import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { type AppLanguage, usePreferences } from "@/context/preferences";
import { useTheme } from "@/hooks/use-theme";

const LANGUAGES: { label: string; value: AppLanguage }[] = [
  { label: "English", value: "en" },
  { label: "Česky", value: "cs" },
];

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = usePreferences();
  const colors = useTheme();

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.center}>
          {t("onboarding.welcome")}
        </ThemedText>
        <ThemedText
          type="default"
          themeColor="textSecondary"
          style={styles.center}
        >
          {t("onboarding.welcomeSub")}
        </ThemedText>

        <View style={styles.langGroup}>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.langLabel}
          >
            {t("settings.language").toUpperCase()}
          </ThemedText>
          <View style={styles.group}>
            {LANGUAGES.map((lang, i) => (
              <View key={lang.value}>
                <TouchableOpacity onPress={() => setLanguage(lang.value)}>
                  <ThemedView type="backgroundElement" style={styles.row}>
                    <ThemedText type="default">{lang.label}</ThemedText>
                    {language === lang.value && (
                      <ThemedText
                        style={[styles.check, { color: colors.highlight }]}
                      >
                        ✓
                      </ThemedText>
                    )}
                  </ThemedView>
                </TouchableOpacity>
                {i < LANGUAGES.length - 1 && (
                  <ThemedView
                    type="backgroundSelected"
                    style={styles.divider}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(onboarding)/permissions")}
      >
        <ThemedView type="backgroundSelected" style={styles.buttonInner}>
          <ThemedText type="smallBold">{t("onboarding.next")}</ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: Spacing.four, justifyContent: "space-between" },
  content: { flex: 1, justifyContent: "center", gap: Spacing.three },
  center: { textAlign: "center" },
  langGroup: { marginTop: Spacing.three, gap: Spacing.one },
  langLabel: { marginBottom: Spacing.one, marginLeft: Spacing.two },
  group: { borderRadius: 12, overflow: "hidden" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.three,
  },
  check: { fontSize: 18, fontWeight: "600" },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: Spacing.three },
  button: { marginTop: Spacing.three },
  buttonInner: {
    padding: Spacing.three,
    borderRadius: 12,
    alignItems: "center",
  },
});
