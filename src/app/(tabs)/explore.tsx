import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";

export default function ExploreScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer style={styles.container}>
      <ThemedText type="title">{t("common.explore")}</ThemedText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
