import { StyleSheet } from "react-native";

import { HoldButton } from "@/components/hold-button";
import { ScreenContainer } from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer style={styles.container}>
      <ThemedText type="title">{t("common.home")}</ThemedText>
      <HoldButton
        onStart={() => console.log("started")}
        onStop={() => console.log("stopped")}
      />
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
